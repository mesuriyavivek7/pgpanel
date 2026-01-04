import mongoose from 'mongoose'

const employeeSchema = new mongoose.Schema({
    employee_name:{
        type:String,
        required:true
    },
    mobile_no: {
        type: String,
        match: [
          /^(?:\+91[-\s]?)?[6-9]\d{9}$/,
          'Mobile number must be valid and can optionally start with +91'
        ],
        trim: true,
        required: true
    },
    salary:{
        type:Number,
        required:true
    },
    employee_type:{
        type:String,
        enum:['Cook','Co-Worker']
    },
    status:{
       type:String,
       default:"Active"
    },
    branch:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Branch'
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
},{timestamps: true})

export default mongoose.model('Employee',employeeSchema)