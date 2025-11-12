import CASHOUT from "../models/CASHOUT.js";
import CUSTOMER from "../models/CUSTOMER.js";
import CUSTOMERRENT from "../models/CUSTOMERRENT.js";
import ACCOUNT from "../models/ACCOUNT.js"
import EMPLOYEE from "../models/EMPLOYEE.js";
import EMPLOYEESALARY from "../models/EMPLOYEESALARY.js";
import INVENTORYPURCHASE from "../models/INVENTORYPURCHASE.js";
import MONTHLYPAYMENT from "../models/MONTHLYPAYMENT.js";
import MONTHLYPAYMENTRECEIPT from "../models/MONTHLYPAYMENTRECEIPT.js";
import TRANSACTION from "../models/TRANSACTION.js";
import RENTATTEMPT from "../models/RENTATTEMPT.js";
import SALARYATTEMPT from "../models/SALARYATTEMPT.js";
import DEPOSITEAMOUNT from "../models/DEPOSITEAMOUNT.js";
import BANKACCOUNT from "../models/BANKACCOUNT.js";

export const createTransactionForCustomerRent = async (req, res, next) =>{
   try{
     const {mongoid, userType} = req 
     
     const {amount, payment_mode, customer, bank_account, month, year, isDeposite, isSettled} = req.body 

     if(!customer || !month || !year || isSettled===null || isSettled===undefined || isDeposite===null || isDeposite===undefined) return res.status(400).json({message:"Please provide all required fields.",success:false})

     if(!isDeposite && (!amount || !payment_mode || !bank_account)) return res.status(400).json({message:"Please provide all required fields.",success:false})

     const existCustomer = await CUSTOMER.findById(customer)

     if(!existCustomer) return res.status(404).json({message:"Customer not found.",success:false})

     if(userType === "Account"){
       const account = await ACCOUNT.findById(mongoid) 

       if(!account) return res.status(404).json({message:"Account manager not found.",success:false})

       if(!account.branch.includes(existCustomer.branch)) return res.status(403).json({message:"You have not access to take rent for this for this customer.",success:false})
     }

     if(amount < 0) return res.status(400).json({message:"amount value is invalid.",success:false})

     if(month < 1 || month > 12) return res.status(400).json({message:"Month value is invalid.",success:false})

     const customerRent = await CUSTOMERRENT.findOne({customer, month, year})

     if(!customerRent) return res.status(404).json({message:"Customer rent is not found for this month.",success:false})

     if(customerRent.status === "Paid") return res.status(200).json({message:"Customer rent is already paid for this month", success:true})

     if(isDeposite){
        customerRent.isDeposite = true
        customerRent.status = 'Paid'

        const defaultBankAccount = await BANKACCOUNT.findOne({is_default:true})

        existCustomer.in_notice_period = true 

        //Withdraw the deposite amount from customer deposite balance
        const depositeAmount = new DEPOSITEAMOUNT({
            customer,
            amount: existCustomer.deposite_amount
        })

        const depositeTransaction = new TRANSACTION({
            transactionType:'withdrawal',
            type:'deposite',
            refModel:'Depositeamount',
            refId:depositeAmount._id,
            payment_mode:'cash',
            branch:existCustomer.branch,
            bank_account:defaultBankAccount._id
        })

        //Add deposite amount into customer rent amount
        const rentAttempt = new RENTATTEMPT({
           customer,
           amount: existCustomer.deposite_amount,
           month,
           year
        })

        const rentTransaction = new TRANSACTION({
          transactionType:'income',
          type:'rent_attempt',
          refModel:'Rentattempt',
          refId:rentAttempt._id,
          payment_mode:'cash',
          branch:existCustomer.branch,
          bank_account:defaultBankAccount._id
        })

        await customerRent.save()
        await depositeAmount.save()
        await depositeTransaction.save()
        await rentAttempt.save()
        await rentTransaction.save()
        await existCustomer.save()


        return res.status(200).json({message:"Customer rent as deposite paid successfully.",success:true,data:customerRent})
     }else if(isSettled){
        customerRent.isSettled = true 
        customerRent.status = 'Paid'
        customerRent.paid_amount += amount 

        const newRentAttempt = new RENTATTEMPT({
          customer,
          amount,
          month,
          year
        })

        const newTransaction = new TRANSACTION({
          transactionType:'income',
          type:'rent_attempt',
          refModel:'Rentattempt',
          refId:newRentAttempt._id,
          payment_mode,
          branch:existCustomer.branch,
          bank_account
        })

         await newRentAttempt.save()
         await newTransaction.save()
         await customerRent.save()

         return res.status(200).json({message:"Customer rent marked as setteled successfully.",success:true})

     }else{
        let pendingAmount = customerRent.rent - customerRent.paid_amount

        if(amount > pendingAmount){
           return res.status(400).json({message:`You have only pending amount of ${pendingAmount}`,success:false})
        }
 
       customerRent.paid_amount += amount
       if(pendingAmount === amount){  
         customerRent.status = "Paid"
       }

       const newRentAttempt = new RENTATTEMPT({
           customer,
           amount,
           month,
           year
       })

       const newTransaction = new TRANSACTION({
           transactionType:'income',
           type:'rent_attempt',
           refModel:'Rentattempt',
           refId:newRentAttempt._id,
           payment_mode,
           branch:existCustomer.branch,
           bank_account
       })

       await customerRent.save()
       await newRentAttempt.save()
       await newTransaction.save()

       return res.status(200).json({message:"New transaction created successfully.",success:true,data:newTransaction})
    }
     
   }catch(err){
     next(err)
   }
}

export const createTransactionForAdvanceRentPay = async (req, res, next) =>{
   try{
      const {mongoid, userType} = req 

      const {customer, amount, payment_mode, month, year, bank_account} = req.body

      if(!customer || !amount || !payment_mode || !month || !year || !bank_account) return res.status(400).json({message:"Please provide all required fields.",success:false})

      const existCustomer = await CUSTOMER.findById(customer)

      if(!existCustomer) return res.status(404).json({message:"Customer not found.",success:false})

      if(userType === "Account"){
         const account = await ACCOUNT.findById(mongoid)

         if(!account) return res.status(404).json({message:"Account manager not found.",success:false})

         if(!account.branch.includes(existCustomer.branch)){
            return res.status(403).json({message:"You have not access to take advance rent for this customer.",success:false})
         }

      }

      if(amount < 0) return res.status(400).json({message:"amount value is invalid.",success:false})

      const isRentPaid = existCustomer.rent_amount === amount

      //Create customer rent 
      const customerRent = new CUSTOMERRENT({
         customer,
         rent:existCustomer.rent_amount,
         paid_amount:amount,
         month,
         year,
         status:isRentPaid ? 'Paid' : 'Pending',
      })

      const rentAttempt = new RENTATTEMPT({
         customer,
         amount,
         month,
         year
      })

      const transaction = new TRANSACTION({
         transactionType:'income',
         type:'rent_attempt',
         refModel:'Rentattempt',
         refId:rentAttempt._id,
         payment_mode,
         branch:existCustomer.branch,
         bank_account
      })

      await customerRent.save()
      await rentAttempt.save()
      await transaction.save()

      return res.status(200).json({message:"Advance rent paid successfully.",success:true})


   }catch(err){
      next(err)
   }
}

export const createTransactionForDepositeAmount = async (req, res, next) =>{
   try{
      const {mongoid, userType} = req
      const {customer, amount, bank_account, payment_mode} = req.body

      if(!customer || !amount || !bank_account || !payment_mode) return res.status(400).json({message:"Please provide all required fields.",success:false})

      const existCustomer = await CUSTOMER.findById(customer)

      if(!existCustomer) return res.status(404).json({message:"Customer not found.",success:false})

      if(userType === "Account"){
         const account = await ACCOUNT.findById(mongoid)

         if(!account) return res.status(404).json({message:"Account not found.",success:false})

         if(!account.branch.includes(existCustomer.branch.toString())){
            return res.status(403).json({message:"You are not authorized to create transaction for this customer.",success:false})
         }
      }

      if(amount < 0) return res.status(400).json({message:"amount value is invalid.",success:false})

      if((existCustomer.paid_deposite_amount + amount) > existCustomer.deposite_amount){
         return res.status(400).json({message:"Deposite amount exceeds the customer's deposite amount.",success:false})
      }

      const newDepositeAmount = new DEPOSITEAMOUNT({
         customer,
         amount
      })

      const newTransaction = new TRANSACTION({
         transactionType:'deposite',
         type:'deposite',
         refModel:'Depositeamount',
         refId:newDepositeAmount._id,
         payment_mode,
         branch:existCustomer.branch,
         bank_account,
      })

      if(existCustomer.paid_deposite_amount + amount === existCustomer.deposite_amount){
         existCustomer.deposite_status = 'Paid'
         await existCustomer.save()
      }

      existCustomer.paid_deposite_amount += amount

      await newDepositeAmount.save()
      await newTransaction.save()
      await existCustomer.save()

      return res.status(200).json({message:"New transaction created for deposite amount.",success:true,data:newTransaction})

   }catch(err){
      next(err)
   }
} 


export const createTransactionForEmployeeSalary = async (req, res, next) =>{
   try{
      const {mongoid, userType} = req
      const {amount, payment_mode, employee, year, bank_account, month} = req.body

      if(!amount || !payment_mode || !bank_account || !employee || !year || !month){
          return res.status(400).json({message:"Please provide required fields.",success:false})
      }

      const existEmployee = await EMPLOYEE.findById(employee)

      if(!existEmployee) return res.status(404).json({message:"Employee is not found.",success:false})

      if(userType === "Account"){
         const account = await ACCOUNT.findById(mongoid) 

         if(!account) return res.status(404).json({message:"Account manager not found."})

         if(!account.branch.includes(existEmployee.branch)){
            return res.status(403).json({message:"You have not access to give salary for this employee.",success:false})
         }
      }

      if(amount < 0) return res.status(400).json({message:"Invalid amount value.",success:false})

      if(month < 1 || month > 12) return res.status(400).json({message:"Invalid month value",success:false})

      const employeeSalary = await EMPLOYEESALARY.findOne({employee, month, year})

      if(!employeeSalary) return res.status(404).json({message:"Employee salary is not found for this month.",success:false})

      if(employeeSalary.status === "Paid") return res.status(200).json({message:"Employee salary is already paid for this month.",success:true})

      let pendingAmount = employeeSalary.salary - employeeSalary.paid_amount

      if(amount > pendingAmount){   
         return res.status(400).json({message:`You have only pending amount of ${pendingAmount}`,success:false})
      }

      employeeSalary.paid_amount += amount

      if(pendingAmount === amount){
         employeeSalary.status = "Paid"
      }

      const newSalaryAttempt = new SALARYATTEMPT({
         employee,
         amount,
         month,
         year
      })

      const newTransaction = new TRANSACTION({     
         transactionType:'expense',
         type:'salary_attempt',
         refModel:'Salaryattempt',
         refId:newSalaryAttempt._id,
         payment_mode,
         branch:existEmployee.branch,
         bank_account
      })

      await employeeSalary.save()
      await newSalaryAttempt.save()
      await newTransaction.save()

      return res.status(200).json({message:"New Transaction created for employee salary.",success:true, data:newTransaction})

   }catch(err){
      next(err)
   }
}

export const createTransactionForEmployeeAdvancePay = async (req, res, next) =>{
      const {mongoid, userType} = req 

      const {employee, amount, payment_mode, month, year, bank_account} = req.body

      if(!employee || !amount || !payment_mode || !month || !year || !bank_account) return res.status(400).json({message:"Please provide all required fields.",success:false})

      const existEmployee = await EMPLOYEE.findById(employee)

      if(!existEmployee) return res.status(404).json({message:"Employee not found.",success:false})

      if(userType === "Account"){
         const account = await ACCOUNT.findById(mongoid)

         if(!account) return res.status(404).json({message:"Account manager not found.",success:false})

         if(!account.branch.includes(existEmployee.branch)){
            return res.status(403).json({message:"You have not access to take advance rent for this customer.",success:false})
         }

      }

      if(amount < 0) return res.status(400).json({message:"amount value is invalid.",success:false})

      const isRentPaid = existCustomer.rent_amount === amount

      //Create customer rent 
      const employeeSalary = new EMPLOYEESALARY({
         employee,
         rent:existEmployee.salary,
         paid_amount:amount,
         month,
         year,
         status:isRentPaid ? 'Paid' : 'Pending',
      })

      const salaryAttempt = new SALARYATTEMPT({
         employee,
         amount,
         month,
         year
      })

      const transaction = new TRANSACTION({
         transactionType:'income',
         type:'salary_attempt',
         refModel:'Salaryattempt',
         refId:salaryAttempt._id,
         payment_mode,
         branch:existEmployee.branch,
         bank_account
      })

      await employeeSalary.save()
      await salaryAttempt.save()
      await transaction.save()

      return res.status(200).json({message:"Advance rent paid successfully.",success:true})
}

export const createTransactionForInventory = async (req, res, next) =>{
   try{
      const {mongoid, userType} = req 
      const {amount, payment_mode, branch, item_name, bank_account, item_type } = req.body
      
      if(!amount || !payment_mode || !bank_account || !branch || !item_name || !item_type){
         return res.status(400).json({message:"Please provide all required fields.",success:false})
      }

      if(userType === "Account"){
         const account = await ACCOUNT.findById(mongoid) 

         if(!account) return res.status(404).json({message:"Account manager not found.",success:false})

         if(!account.branch.includes(branch)) return res.status(403).json({message:"You have not access to take inventory for this branch.",success:false})
      }

      if(amount < 0) return res.status(400).json({message:"amount value is invalid.",success:false})

      const newInventoryPurchaseRecipt = new INVENTORYPURCHASE({
         item_name,
         item_type,
         amount
      })

      await newInventoryPurchaseRecipt.save()

      const newTransaction = new TRANSACTION({
         transactionType:'expense',
         type:'inventory_purchase',
         refModel:'Inventorypurchase',
         refId:newInventoryPurchaseRecipt,
         payment_mode,
         branch,
         bank_account
      })

      await newTransaction.save()

      return res.status(200).json({message:"New transaction created for inventory.",success:true,data:newTransaction})

   }catch(err){
      next(err)
   }
}

export const createTransactionForMonthlyPayment = async (req, res, next) =>{
   try{
     const {mongoid, userType} = req
      
     const {monthlypayment, amount, month, year, payment_mode, bank_account} = req.body

     if(!monthlypayment || !month || !year || !bank_account) return res.status(400).json({message:"Please provide all required fields.",success:false})

     const existMonthlyPayment = await MONTHLYPAYMENT.findById(monthlypayment)

     if(!existMonthlyPayment) return res.status(404).json({message:"Monthly payment is not found.",success:false})

     if(userType === "Account"){
       const account = await ACCOUNT.findById(mongoid)

       if(!account) return res.status(404).json({message:"Account manager not found.",success:false})

       if(!account.branch.includes(existMonthlyPayment.branch)) return res.status(403).json({message:"You have not access to take monthly payment for this branch.",success:false})
     }

     const {payment_name, branch} = existMonthlyPayment

     const newMonthlyPaymentReceipt = new MONTHLYPAYMENTRECEIPT({
        monthly_payment:monthlypayment,
        payment_name,
        amount,
        month,
        year
     })

     await newMonthlyPaymentReceipt.save()

     const newTransaction = new TRANSACTION({
       transactionType:'expense',
       type:'monthly_bill',
       refModel:'Monthlypaymentreceipt',
       refId:newMonthlyPaymentReceipt,
       payment_mode,
       branch,
       bank_account
     })

     await newTransaction.save()

     return res.status(200).json({message:"New transaction created successfully.",success:true,data:newTransaction})
     
   }catch(err){
     next(err)
   }
} 


export const createTransactionForCashout = async (req, res, next) =>{
   try{
      const {amount, person_name , payment_mode, bank_account, notes, mobile_no, transactionType} = req.body

      if(!amount || !person_name || !payment_mode || !bank_account || !transactionType) return res.status(400).json({message:"Please provide required fields.",success:false})

      if(amount < 0) return res.status(400).json({message:"Invalid amount type.",success:false})
      
      const newCashOut = new CASHOUT({
         person_name,
         mobile_no,
         amount,
         notes
      })
      
      await newCashOut.save()

      const newTransaction = new TRANSACTION({
         transactionType,
         type:'cash_given',
         refModel:'Cashout',
         refId:newCashOut,
         payment_mode,
         bank_account
      })

      await newTransaction.save()

      return res.status(200).json({message:"New transaction created successfully.",success:true,data:newTransaction})


   }catch(err){
      next(err)
   }
}


export const getAllTransactions = async (req, res, next) =>{
   try{
      const {mongoid, userType} = req 

      const {branch, bank_account ,transactionType} = req.query
        
      let filter = {}

      if(userType === "Account"){      
         const account = await ACCOUNT.findById(mongoid)

         if(!account) return res.status(404).json({message:"Account manager not found.",success:false})

         if(branch){
            if(!account.branch.includes(branch)) return res.status(403).json({message:"You have not access to see transactions for this branch.",success:false})

            filter.branch = branch
         }else{
            filter.branch = {$in:account.branch}
         }
      }else{
         if(branch){
            filter.branch = branch
         }
      }

      if(bank_account) {
         filter.bank_account = bank_account
      }

      if(transactionType) {
         filter.type = transactionType
      }

      const transactions = await TRANSACTION.find(filter).
      populate("refId").
      populate('branch').
      populate('bank_account')

      return res.status(200).json({message:"All transaction retrived successfully.",success:true,data:transactions})

   }catch(err){
      next(err)
   }
}