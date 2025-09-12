import INVENTORYPURCHASE from "../models/INVENTORYPURCHASE.js";
import TRANSACTION from "../models/TRANSACTION.js";


export const getAllInventoryTransaction = async (req, res, next) => {
    try {
        const { searchQuery, branch } = req.query
        const { mongoid, userType } = req

        let filter = {}

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
                filter = { branch: { $in: acmanager.branch } }
            }

        } else {
            if (branch) {
                filter.branch = branch
            }
        }

        filter = {
            type: 'inventory_purchase'
        };

        let inventoryIds = []
        if (searchQuery) {
            const inventoryDocs = await INVENTORYPURCHASE.find({
                item_name: { $regex: searchQuery, $options: 'i' }
            }).select('_id')

            inventoryIds = inventoryDocs.map(doc => doc._id)

            filter.refId = { $in: inventoryIds }
        }

        console.log(filter)

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