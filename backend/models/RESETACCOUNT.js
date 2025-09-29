import mongoose from 'mongoose';

const ResetAccountSchema = new mongoose.Schema({
    bankaccount:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'BankAccount',
        required:true
    },
    resetDate:{
        type:Date,
        required:true,
        default: Date.now
    }

},{timestamps:true});

export default mongoose.model('ResetAccount', ResetAccountSchema);