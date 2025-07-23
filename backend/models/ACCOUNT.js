import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
    full_name:{
        type:String,
        required:[true,'Full name is required.']
    },
    contact_no: {
        type: String,
        match: [
          /^(?:\+91[-\s]?)?[6-9]\d{9}$/,
          'Mobile number must be valid and can optionally start with +91'
        ],
        trim: true
    },
    email:{
        type: String,
        lowercase: true,
        trim: true,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/,
          'Please fill a valid email address'
        ]
    }
},{timestamps:true})

export default mongoose.model('Account',accountSchema)