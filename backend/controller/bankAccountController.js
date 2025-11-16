import BANKACCOUNT from "../models/BANKACCOUNT.js";
import RESETACCOUNT from "../models/RESETACCOUNT.js";
import TRANSACTION from "../models/TRANSACTION.js";

export const createBankAccount = async (req, res, next) =>{
    try{
        const {account_holdername} = req.body

        if(!account_holdername) return res.status(400).json({message:"Please provide account holder name.",success:false})

        const existBankAccount = await BANKACCOUNT.findOne({account_holdername})

        if(existBankAccount) return res.status(409).json({message:"Account is already exist.",success:false})

        const defaultBankAccount = await BANKACCOUNT.findOne({is_default:true})

        const newBankAccount = new BANKACCOUNT({
            account_holdername,
            is_default : defaultBankAccount ? false : true
        })

        await newBankAccount.save()

        return res.status(200).json({message:"New bank account created successfully.",success:true,data:newBankAccount})

    }catch(err){
        next(err)
    }
}

export const getAllBankAccount = async (req, res, next) =>{
    try{
        const allAccounts = await BANKACCOUNT.find({status:'active'})

        const transactions = await TRANSACTION.find({
            transactionType: { $in: ['expense', 'income'] }
          })
        .populate('refId')
        .populate('bank_account')

        //Fetch all reset once 
        const resets = await RESETACCOUNT.find()

        const accountData = allAccounts.map(acc => {
            //Get all reset docs where this account is included
            const accResets = resets.filter(r => r.bankaccount.some(b => b.toString() === acc._id.toString()))

            //if multiple reset then take latest one
            let latestResetDate = null 
            if (accResets.length > 0) {
                latestResetDate = accResets
                  .map(r => new Date(r.resetDate))
                  .sort((a, b) => b - a)[0]
            }

           // Filter transactions for this account
           let accTx = transactions.filter(
              t => t.bank_account && t.bank_account._id.toString() === acc._id.toString()
           )

           // Apply reset filter if exists
           if (latestResetDate) {
             accTx = accTx.filter(t => new Date(t.createdAt) > latestResetDate)
           }

           //Calculate balance 
           let balance = 0
           accTx.forEach(tx => {
            if (!tx.refId?.amount) return
            if (tx.transactionType === "income") {
            balance += tx.refId.amount
           } else {
             balance -= tx.refId.amount
           }
           })

          return {
            _id: acc._id,
            account_holdername: acc.account_holdername,
            current_balance: balance,
            is_default: acc.is_default,
            last_reset: latestResetDate || null
          }

        })

        return res.status(200).json({
            message: "All bank accounts retrieved successfully.",
            success: true,
            data: accountData,
        })

    }catch(err){
        next(err)
    }
}


export const updateBankAccount = async (req, res, next) =>{
    try{
        const {accountId} = req.params 
        const {account_holdername} = req.body 

        if(!accountId) return res.status(400).json({message:"Please provide account id.",success:false}) 

        const bankAccount = await BANKACCOUNT.findOne({_id:accountId, status:'active'}) 

        if(!bankAccount) return res.status(404).json({message:"Bank account not found.",success:false})

        if(account_holdername){

            if(bankAccount.account_holdername!== account_holdername){
                const existingBankAccount = await BANKACCOUNT.findOne({account_holdername:bankAccount})

                if(existingBankAccount) return res.status(409).json({message:"Bank account is already exist.",success:false})
            }

            bankAccount.account_holdername = account_holdername 

        }

        if(is_default !== undefined){
            bankAccount.is_default = is_default
        }

        await bankAccount.save()

        return res.status(200).json({message:"Bank account name updated successfully.",success:true})
        

    }catch(err){
        next(err)
    }
}


export const deleteBankAccount = async (req, res, next) =>{
    try{
        const {accountId} = req.params 

        if(!accountId) return res.status(400).json({message:"Please provide account id.",success:false}) 

        const bankAccount = await BANKACCOUNT.findById(accountId) 

        if(!bankAccount) return res.status(404).json({message:"Bank account not found.",success:false})

        const transactions = await TRANSACTION.find()
        .populate('refId')
        .populate('bank_account')

        //Fetch all reset once 
        const resets = await RESETACCOUNT.find()

        const accResets = resets.filter(r => r.bankaccount.some(b => b.toString() === bankAccount._id.toString()))

        //If multiple reset then take latest one
        let latestResetDate = null 

        if (accResets.length > 0) {
            latestResetDate = accResets
              .map(r => new Date(r.resetDate))
              .sort((a, b) => b - a)[0]
        }

        // Filter transactions for this account
        let accTx = transactions.filter(
            t => t.bank_account && t.bank_account._id.toString() === bankAccount._id.toString()
        )

        //Apply reset filter if exists
        if (latestResetDate) {
            accTx = accTx.filter(t => new Date(t.createdAt) > latestResetDate)
        }

        //Calculate balance 
        let balance = 0
        accTx.forEach(tx => {
         if (!tx.refId?.amount) return
         if (tx.transactionType === "income") {
         balance += tx.refId.amount
        } else {
          balance -= tx.refId.amount
        }
        })

        if(balance === 0){
            if(bankAccount.is_default){
                //Find another account to set default true
                const anotherAccount = await BANKACCOUNT.findOne({_id:{$ne:bankAccount._id}, status:{$ne:'deleted'}})

                if(anotherAccount){
                    anotherAccount.is_default = true
                    await anotherAccount.save()
                }
            }
            bankAccount.status = 'deleted'
            await bankAccount.save()

            return res.status(200).json({message:"Your account is deleted successfully.",status:true})

        }else{
            return res.status(200).json({message:"You can't delete your account. first of all you need to reset your account.",status:false})
        }
    }catch(err){
        next(err)
    }
}


export const resetBankAccount = async (req, res, next) =>{
    try{
        const {accountId} = req.params 

        if(!accountId) return res.status(400).json({message:"Please provide account id.",success:false})

        const accountIds = [accountId]

        const newResetBankAccount = new RESETACCOUNT({bankaccount:accountIds})

        await newResetBankAccount.save()

        return res.status(200).json({message:"Bank account reset successfully.",success:true,data:newResetBankAccount})

    }catch(err){
        next(err)
    }
}

export const resetAllBankAccount = async (req, res, next) =>{
    try{
        const allAccounts = await BANKACCOUNT.find()

        if(allAccounts.length === 0) return res.status(400).json({message:"No bank account found.", success: false})

        const accountIds = allAccounts.map(acc => acc._id)

        const newResetBankAccount = new RESETACCOUNT({
            bankaccount:accountIds
        })

        await newResetBankAccount.save()

        return res.status(200).json({message:"All bank account reset successfully.", success: true})

    }catch(err){
        next(err)
    }
}

export const setDefaultBankAccount = async (req, res, next) =>{
    try{
        const {accountId} = req.params 

        if(!accountId) return res.status(400).json({message:"Please provide account id.",success:false}) 

        const bankAccount = await BANKACCOUNT.findById(accountId) 

        if(!bankAccount) return res.status(404).json({message:"Bank account not found.",success:false})

        //Unset previous default account
        await BANKACCOUNT.updateMany({is_default:true}, {$set:{is_default:false}})

        //Set new default account
        bankAccount.is_default = true
        await bankAccount.save()

        return res.status(200).json({message:"Bank account set as default successfully.",success:true})

    }catch(err){
        next(err)
    }
}