import mongoose from "mongoose";

const cronLogSchema = new mongoose.Schema({
    task:{
        type:String,
        required:true,
        enum:['Customer Rent Generation','Employee Salary Generation']
    },
    month:{
        type:Number,
        required:true,
        min:1,
        max:12
    },
    year:{
        type:Number,
        required:true,
    },
    status:{
        type:String,
        required:true,
        enum:['Success','Failed']
    },
    count:{
        type:Number,
        default:0
    },
},{timestamps:true})

export default mongoose.model('Cronlog',cronLogSchema)