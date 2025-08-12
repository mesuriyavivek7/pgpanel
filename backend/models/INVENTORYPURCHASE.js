import mongoose from "mongoose";

const inventoryPurchaseSchema = new mongoose.Schema({
     item_name:{
        type:String,
        required:true
     },
     item_type:{
        type:String,
        enum:['Vegetable','Grocery','Other']
     },
     amount:Number
},{timestamps:true})

export default mongoose.model('Inventorypurchase',inventoryPurchaseSchema)