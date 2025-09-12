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

export const createTransactionForCustomerRent = async (req, res, next) =>{
   try{
     const {mongoid, userType} = req 
     
     const {amount, payment_mode, customer, bank_account, month, year} = req.body 

     if(!amount || !payment_mode || !customer || !month || !year) return res.status(400).json({message:"Please provide all required fields.",success:false})

     const existCustomer = await CUSTOMER.findById(customer)

     if(!existCustomer) return res.status(404).json({message:"Customer not found.",success:false})

     if(userType === "Account"){
       const account = await ACCOUNT.findById(mongoid) 

       if(!account) return res.status(404).json({message:"Account manager not found.",success:false})

       if(!account.branch.includes(existCustomer.branch)) return res.status(403).json({message:"You have not access to take rent for this for this customer.",success:false})
     }

     if(amount < 0) return res.status(400).json({message:"amount value is invalid.",success:false})

     if(month < 1 || month > 12) return res.status(400).json({message:"Month value is invalid.",success:false})

     //Create new recipt
     const newCustomerRentRecipt = new CUSTOMERRENT({
        customer,
        amount,
        month,
        year
     })
 
     await newCustomerRentRecipt.save()

     const newTransaction = new TRANSACTION({
        transactionType:'income',
        type:'customer_rent',
        refModel:'Customerrent',
        refId:newCustomerRentRecipt,
        payment_mode,
        branch:existCustomer.branch,
        bank_account
     })

     await newTransaction.save()

     return res.status(200).json({message:"New transaction created successfully.",success:true,data:newTransaction})
     
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

      const newEmployeeSalaryRecipt = new EMPLOYEESALARY({
         employee,
         amount,
         month,
         year
      })

      await newEmployeeSalaryRecipt.save()

      const newTransaction = new TRANSACTION({
         transactionType:'expense',
         type:'employee_salary',
         refModel:'Employeesalary',
         refId:newEmployeeSalaryRecipt,
         payment_mode,
         branch:existEmployee.branch,
         bank_account
      })

      await newTransaction.save()

      return res.status(200).json({message:"New Transaction created for employee salary.",success:true, data:newTransaction})

   }catch(err){
      next(err)
   }
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