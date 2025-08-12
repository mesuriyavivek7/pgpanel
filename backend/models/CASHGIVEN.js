import mongoose from "mongoose";

const cashGivenSchema = new mongoose.Schema({
   person_name:{
    type:String,
    required:true
   },
   amount:Number,
   reason:String
})

export default mongoose.model('Cashgiven',cashGivenSchema)