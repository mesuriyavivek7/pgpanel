import mongoose from "mongoose";

const employeeSalarySchema = new mongoose.Schema({
   employee:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Employee'
   },
   salary:{
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
   month:Number,
   year:Number
},{timestamps:true}) 

export default mongoose.model('Employeesalary',employeeSalarySchema)