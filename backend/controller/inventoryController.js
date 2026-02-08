import INVENTORYPURCHASE from "../models/INVENTORYPURCHASE.js";
import TRANSACTION from "../models/TRANSACTION.js";
import ACCOUNT from "../models/ACCOUNT.js";


export const getAllInventoryTransaction = async (req, res, next) => {
    try {
        const { searchQuery, branch } = req.query
        const { mongoid, userType } = req

        let filter = {
            type: 'inventory_purchase'
        };

        if (userType === 'Account') {
            const acmanager = await ACCOUNT.findById(mongoid)

            if (!acmanager) {
                return res.status(404).json({ message: "Account manager not found.", success: false })
            }

            if (branch) {
                if (!acmanager.branch.includes(branch)) {
                    return res.status(403).json({ message: "You are not Autherized to view transactions of this Branch.", success: false })
                }
                
                filter.branch = branch
            } else {
                console.log("branch filter set")
                filter.branch =  { $in: acmanager.branch } 
            }

        } else {
            if (branch) {
                filter.branch = branch
            }
        }

        let inventoryIds = []
        if (searchQuery) {
            const inventoryDocs = await INVENTORYPURCHASE.find({
                item_name: { $regex: searchQuery, $options: 'i' }
            }).select('_id')

            inventoryIds = inventoryDocs.map(doc => doc._id)

            filter.refId = { $in: inventoryIds }
        }

        const transactions = await TRANSACTION.find(filter)
            .populate({
                path: 'refId',
                model: 'Inventorypurchase'
            })
            .populate('branch')
            .sort({ createdAt: -1 })

            

        return res.status(200).json({ message: "All transaction retrived successfully.", success: true, data: transactions })

    } catch (err) {
        next(err)
    }
}


export const updateInventory = async (req, res, next) =>{
    try{
        const {transactionId} = req.params
        const {item_name, item_type, amount, branch, payment_mode, bank_account} = req.body 

        if(!transactionId) return res.status(400).json({message:"Please provide transaction id.", success: false})

        const transaction = await TRANSACTION.findById(transactionId)

        if(!transaction) return res.status(400).json({message:"Transaction not found."})

        if(transaction.type !== "inventory_purchase") return res.status(400).json({message:"Invalid transaction.", success: false})

        const inventoryId = transaction.refId 

        const inventory = await INVENTORYPURCHASE.findById(inventoryId) 

        if(!inventory) return res.status(404).json({message:"Inventory not found.",success: false})

        //Update for inventory
        if(item_name) inventory.item_name = item_name 
        if(item_type) inventory.item_type = item_type 
        if(amount !== null || amount !== undefined) inventory.amount = amount

        //Update for transaction 
        if(branch) transaction.branch = branch 
        if(payment_mode) transaction.payment_mode = payment_mode
        if(bank_account) transaction.bank_account = bank_account
        
        await inventory.save() 
        await transaction.save()

        return res.status(200).json({message:"Inventory item updated.",success:true})

    }catch(err){
        next(err)
    }
}