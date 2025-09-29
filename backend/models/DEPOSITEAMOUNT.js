import mongoose from "mongoose";

const depositeAmountSchema = new mongoose.Schema({
   customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Customer'
   },
   amount:{
    type:Number,
    required:true
   }
},{timestamps:true})

export default mongoose.model('Depositeamount',depositeAmountSchema)