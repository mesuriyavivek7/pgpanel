import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    full_name:{
        type:String,
        required:[true, 'Full name is required.']
    },
    email:{
        type: String,
        lowercase: true,
        trim: true,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/,
          'Please fill a valid email address'
        ]
    },
},{timestamps:true})

export default mongoose.model('Admin',adminSchema)