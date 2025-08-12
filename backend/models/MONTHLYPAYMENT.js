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
    }
},{timestamps:true})


export default mongoose.model('Monthlypayment',monthlyPaySchema)


