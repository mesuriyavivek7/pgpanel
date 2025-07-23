import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    room_id:{
        type:String,
        required:true,
        trim:true
    },
    capacity:{
        type:Number,
        required:true,
        min: [1, 'Capacity must be at least 1'],
    },
    filled:{
        type:Number,
        required:true,
        default:0,
        min: [0, 'Filled cannot be negative'],
    },
    remark:{
        type:String,
        trim:true
    },
    branch:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Branch',
        required:true
    },
    added_by:{
        type:mongoose.Schema.Types.ObjectId,
        refPath:'added_by_type',
        required:true
    },
    added_by_type:{
        type:String,
        enum:['Admin','Account'],
        required:true
    }
},{timestamps:true})


export default mongoose.model('Room',roomSchema)