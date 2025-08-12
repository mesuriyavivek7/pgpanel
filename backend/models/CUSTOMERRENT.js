import mongoose from "mongoose";

const customerrentSchema = new mongoose.Schema({
    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Customer'
    },
    amount:Number,
    month:Number,
    year:Number
},{timestamps:true})

export default mongoose.model('Customerrent',customerrentSchema)