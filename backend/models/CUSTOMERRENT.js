import mongoose from "mongoose";

const customerrentSchema = new mongoose.Schema({
    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Customer'
    },
    rent:{
      type:Number,
      required:true
    },
    paid_amount:{
      type:Number,
      default:0
    },
    status:{
      type:String,
      enum: ['Paid','Pending'],
      default:'Pending'
    },
    isSettled:{
      type:Boolean,
      default:false
    },
    isDeposite:{
      type:Boolean,
      default:false
    },
    month:Number,
    year:Number
},{timestamps:true})

export default mongoose.model('Customerrent',customerrentSchema)