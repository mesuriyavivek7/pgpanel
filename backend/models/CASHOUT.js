import mongoose from 'mongoose'


const cashoutSchema = new mongoose.Schema({
     person_name:{
        type:String,
        required:true
     },
     mobile_no:{
        type: String,
        match: [
          /^(?:\+91[-\s]?)?[6-9]\d{9}$/,
          'Mobile number must be valid and can optionally start with +91'
        ],
        trim: true,
     },
     amount:{
        type:Number,
        required:true,
     },
     notes:{
        type:String
     }
},{timestamps: true})

export default mongoose.model('Cashout', cashoutSchema)