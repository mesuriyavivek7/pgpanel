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