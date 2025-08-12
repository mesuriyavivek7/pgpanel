import mongoose from 'mongoose'


const bankAccountSchema = new mongoose.Schema({
    account_holdername:{
        type:String,
        required:true
    }
},{timestamps:true})

export default mongoose.model('Bankaccount',bankAccountSchema)