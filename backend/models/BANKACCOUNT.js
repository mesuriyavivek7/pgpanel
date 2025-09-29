import mongoose from 'mongoose'


const bankAccountSchema = new mongoose.Schema({
    account_holdername:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:['active','deleted'],
        default:'active'
    }
},{timestamps:true})

export default mongoose.model('Bankaccount',bankAccountSchema)