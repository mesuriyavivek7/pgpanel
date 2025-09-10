import BANKACCOUNT from "../models/BANKACCOUNT.js";
import TRANSACTION from "../models/TRANSACTION.js";

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

        const transactions = await TRANSACTION.find()
        .populate('refId')
        .populate('bank_account')

        const accountData = allAccounts.map(acc => {
            const accTx = transactions.filter(t => 
                t.bank_account && t.bank_account._id.toString() === acc._id.toString())
    
                let balance = 0;
                accTx.forEach(tx => {
                    if(!tx.refId?.amount) return 
                    if(tx.transactionType === "income"){
                        balance += tx.refId.amount
                    }else{
                        balance -= tx.refId.amount
                    }
                });
    
                return {
                    _id:acc._id,
                    account_holdername: acc.account_holdername,
                    current_balance: balance
                }
        })

        return res.status(200).json({message:"All bank accounts retrived successfully.",success:true, data:accountData})
    }catch(err){
        next(err)
    }
}


export const updateBankAccount = async (req, res, next) =>{
    try{
        const {accountId} = req.params 
        const {account_holdername} = req.body 

        if(!accountId) return res.status(400).json({message:"Please provide account id.",success:false}) 

        const bankAccount = await BANKACCOUNT.findById(accountId) 

        if(bankAccount){

            if(bankAccount.account_holdername!== account_holdername){
                const existingBankAccount = await BANKACCOUNT.findOne({account_holdername:bankAccount})

                if(existingBankAccount) return res.status(409).json({message:"Bank account is already exist.",success:false})
            }

            bankAccount.account_holdername = account_holdername 

            await bankAccount.save()
        }

        return res.status(200).json({message:"Bank account name updated successfully.",success:true})
        

    }catch(err){
        next(err)
    }
}



