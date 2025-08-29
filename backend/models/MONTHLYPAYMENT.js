import mongoose from "mongoose";


const monthlyPaySchema = new mongoose.Schema({
    payment_name:{
        type:String,
        required:true
    },
    notes:{
        type:String
    },
    branch:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Branch'
    },
    amount:{
        type:Number,
        required:true,
        min:[0, 'Monthly bill amount cant be negative.']
    },
    starting_date:{
        type: Date,
        default: () => new Date()
    }
},{timestamps:true})


export default mongoose.model('Monthlypayment',monthlyPaySchema)


