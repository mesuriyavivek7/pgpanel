import mongoose from "mongoose";

const employeeSalarySchema = new mongoose.Schema({
   employee:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Employee'
   },
   amount:Number,
   month:Number,
   year:Number
},{timestamps:true}) 

export default mongoose.model('Employeesalary',employeeSalarySchema)