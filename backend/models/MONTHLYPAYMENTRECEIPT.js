import mongoose from "mongoose";

const monthlyPaymentReceipt = new mongoose.Schema({
    monthly_payment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Monthlypayment'
    },
    payment_name:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    month:{
        type:Number,
        required:true
    },
    year:{
        type:Number,
        required:true
    }
},{timestamps:true})

export default mongoose.model('Monthlypaymentreceipt',monthlyPaymentReceipt)