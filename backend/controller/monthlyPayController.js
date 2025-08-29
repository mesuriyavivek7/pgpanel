import { getMonthYearList } from "../helper.js";
import MONTHLYPAYMENT from "../models/MONTHLYPAYMENT.js";
import TRANSACTION from "../models/TRANSACTION.js";

export const createMonthlyPayment = async (req, res, next) =>{
    try{
        const {payment_name, notes, amount, starting_date, branch} = req.body

        if(!payment_name || !branch || !amount || !starting_date) return res.status(400).json({message:"Please provide all required fields.",success:false})

        const newMonthlyPayment = new MONTHLYPAYMENT({
            payment_name,
            notes,
            amount,
            starting_date,
            branch
        })

        await newMonthlyPayment.save()

        return res.status(200).json({message:"New monthly payment created.",success:true, data:newMonthlyPayment})

    }catch(err){
        next(err)
    }
}

export const getMonthlyPaymentsList = async (req, res, next)=>{
   try{
     const {searchQuery, branch} = req.query 

     let filter = {}

     if(searchQuery) {
        filter.payment_name = { $regex: searchQuery, $options: 'i'}
     }

     if(branch) filter.branch = branch

     const monthlyPayments = await MONTHLYPAYMENT.find(filter).populate('branch')

     const responseData = [];

     for(const bill of monthlyPayments){
        const allMonths = getMonthYearList(bill.starting_date)

        const monthlyTransaction = await TRANSACTION.find({
            transactionType:'expense',
            type:'monthly_bill',
            refModel:'Monthlypaymentreceipt',
            branch:bill.branch._id
        }).populate({
            path:'refId',
            model:'Monthlypaymentreceipt',
            match: {monthly_payment:bill._id}
        })

        const paidMonthlyMap = {} 

        for (const tx of monthlyTransaction){
            const entry = tx.refId 
            if(!entry) continue;

            const key = `${entry.month}-${entry.year}`;
            if(!paidMonthlyMap[key]){
                paidMonthlyMap[key] = 0
            }

            paidMonthlyMap[key] += entry.amount
        }

        const pendingMonths = [];

        for(const {month, year} of allMonths) {
            const key = `${month}-${year}`
            const paid = paidMonthlyMap[key] || 0
            const pending = Math.max(bill.amount - paid , 0)

            if(pending > 0){
                const today = new Date();
                const currentMonth = today.getMonth() + 1;
                const currentYear = today.getFullYear() 

                const isRequired = !(month === currentMonth && year === currentYear)

                pendingMonths.push({
                    month, 
                    year,
                    pending,
                    required: isRequired
                })
            }
        }

        responseData.push({
            billId: bill._id,
            billName: bill.payment_name,
            amount: bill.amount,
            notes:bill.notes,
            startingDate:bill.starting_date,
            pendingMonths: pendingMonths,
            branch:bill.branch
        })

     } 

     return res.status(200).json({message:"All monthly payment retrived successfully.",success:true,data:responseData})


   }catch(err){
     next(err)
   }
}

export const updateMonthlyPaymentDetails = async (req, res, next) =>{
     try{
        const {billId} = req.params 

        const {payment_name, notes, branch} = req.body 

        if(!billId) return res.status(400).json({message:"Please provide bill id.",success:false})

        const bill = await MONTHLYPAYMENT.findById(billId) 

        if(!bill) return res.status(404).json({message:"Monthly bill is not found.",success:false}) 

        if(payment_name) {
            bill.payment_name = payment_name 
        }

        if(notes) {
            bill.notes = notes 
        }

        if(branch) {
            bill.branch = branch 
        }

        await bill.save() 

        return res.status(200).json({message:"Bill amount details updated successfully.",success:true,data:bill})

     }catch(err){
        next(err)
     }
}

export const deleteMonthlyBill = async (req, res, next) =>{
    try{
        const {billId} = req.params 

        if(!billId) return res.status(400).json({message:"Please provide bill id.",success:false})

        const bill = await MONTHLYPAYMENT.findById(billId)

        if(!bill) return res.status(404).json({message:"Bill is not found.",success:false}) 

        await MONTHLYPAYMENT.findByIdAndDelete(billId) 

        return res.status(200).json({message:"Bill deleted successfully.",success:true})

    }catch(err){
        next(err)
    }
}