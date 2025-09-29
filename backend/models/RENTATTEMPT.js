import mongoose from "mongoose";

const rentAttempt = new mongoose.Schema({
    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Customer',
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

export default mongoose.model('Rentattempt',rentAttempt)