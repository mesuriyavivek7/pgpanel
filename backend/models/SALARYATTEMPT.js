import mongoose  from "mongoose";

const salaryAttemptSchema = new mongoose.Schema({
    employee:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Employee',
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    month:{
        type:Number,
        required:true
    },
    year:{
        type:Number,
        required:true
    }
})

export default mongoose.model('Salaryattempt',salaryAttemptSchema)