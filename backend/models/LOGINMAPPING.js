import mongoose from "mongoose";

const loginmappingSchema = new mongoose.Schema({
    mongoid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userType',
        required:true
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
    password:{
        type:String,
        required:[true, 'password is required.']
    },
    userType:{
        type:String,
        enum:['Admin','Account'],
        required:[true, 'user type is required.']
    },
    status:{
        type:Boolean,
        default:true
    }
},{timestamps:true})

export default mongoose.model('Loginmapping',loginmappingSchema)