import BANKACCOUNT from "../models/BANKACCOUNT.js";

export const createBankAccount = async (req, res, next) =>{
    try{
        const {account_holdername} = req.body

        if(!account_holdername) return res.status(400).json({message:"Please provide account holder name.",success:false})

        const existBankAccount = await BANKACCOUNT.findOne({account_holdername})

        if(existBankAccount) return res.status(409).json({message:"Account is already exist.",success:false})

        const newBankAccount = new BANKACCOUNT({
            account_holdername
        })

        await newBankAccount.save()

        return res.status(200).json({message:"New bank account created successfully.",success:true,data:newBankAccount})

    }catch(err){
        next(err)
    }
}

export const getAllBankAccount = async (req, res, next) =>{
    try{
        const allAccounts = await BANKACCOUNT.find()

        return res.status(200).json({message:"All bank accounts retrived successfully.",success:true, data:allAccounts})
    }catch(err){
        next(err)
    }
}
