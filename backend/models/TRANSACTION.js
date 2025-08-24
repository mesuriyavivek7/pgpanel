import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
    transactionType: {
       type:String,
       enum:['expense','income']
    },
    type: {
        type: String,
        enum: ['customer_rent', 'employee_salary', 'monthly_bill', 'inventory_purchase', 'cash_given'],
        required: true
    },
    refModel:{
        type:String,
        required:true
    },
    refId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        refPath:'refModel'
    },
    payment_mode:{
        type:String,
        enum:['cash','online','cheque','upi','bank_transfer'],
        default:'cash'
    },
    branch:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Branch'
    },
    bank_account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Bankaccount'
    }
},{timestamps:true})

export default mongoose.model('Transaction',transactionSchema)