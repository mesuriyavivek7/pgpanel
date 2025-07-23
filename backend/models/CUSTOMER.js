import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  customer_name: {
    type: String,
    required: true
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
  deposite_amount: {
    type: Number,
    required: true,
    min: [0, 'Deposit amount cannot be negative']
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room'
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch'
  },
  status:{
    type:Boolean,
    default:true
  },
  joining_date: {
    type: Date,
    default: () => new Date()
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
}, { timestamps: true });

export default mongoose.model('Customer', customerSchema);
