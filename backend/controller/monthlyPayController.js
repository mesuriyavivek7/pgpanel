import { getMonthYearList } from "../helper.js";
import MONTHLYPAYMENT from "../models/MONTHLYPAYMENT.js";
import TRANSACTION from "../models/TRANSACTION.js";

export const createMonthlyPayment = async (req, res, next) =>{
    try{
        const {payment_name, notes, branch} = req.body

        if(!payment_name || !branch) return res.status(400).json({message:"Please provide all required fields.",success:false})

        const newMonthlyPayment = new MONTHLYPAYMENT({
            payment_name,
            notes,
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
     const {branchId} = req.query 

     let filter = {}

     if(branchId) filter.branch = branchId

     const monthlyPayments = await MONTHLYPAYMENT.find(filter).populate('branch')

     const responseData = [];

     for(const bill of monthlyPayments){
        const allMonths = getMonthYearList(bill.createdAt)

        const transaction = await TRANSACTION.find({
            transactionType:'expense',
            type:'monthly_bill',
            refModel:'Monthlypaymentreceipt',
            branch:bill.branch._id
        }).populate({
            path:'refId',
            model:'Monthlypaymentreceipt',
            match: {monthly_payment:bill._id}
        })

        //Extract paid months
        const paidMonthSet = new Set()
        for (const tx of transaction){
            if(tx.refId) {
                paidMonthSet.add(`${tx.refId.month}-${tx.refId.year}`)
            }
        }

        const pendingMonths = allMonths.filter(
            ({ month, year }) => !paidMonthSet.has(`${month}-${year}`)
        );

        responseData.push({
            monthlypaymentId: bill._id,
            payment_name: bill.payment_name,
            notes: bill.notes || "",
            branch: bill.branch?.branch_name || "", // Adjust field name if different
            pending_months: pendingMonths,
            pending: pendingMonths.length > 0,
            createdAt: bill.createdAt
        })

     } 

     return res.status(200).json({message:"All monthly payment retrived successfully.",success:true,data:responseData})


   }catch(err){
     next(err)
   }
}

