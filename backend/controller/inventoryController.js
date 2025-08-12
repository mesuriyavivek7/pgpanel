import INVENTORYPURCHASE from "../models/INVENTORYPURCHASE.js";
import TRANSACTION from "../models/TRANSACTION.js";


export const getAllInventoryTransaction = async (req, res, next) =>{
    try{
        const {searchQuery, branch} = req.query

        const filter = {
            type: 'inventory_purchase'
        };

        if (branch) {
            filter.branch = branch
        }

        let inventoryIds = [] 
        if(searchQuery){
            const inventoryDocs = await INVENTORYPURCHASE.find({
                item_name: { $regex:searchQuery, $options: 'i'}
            }).select('_id')

            inventoryIds = inventoryDocs.map(doc => doc._id)

            filter.refId = {$in : inventoryIds}
        }

        const transactions = await TRANSACTION.find(filter)
        .populate({
            path:'refId',
            model:'Inventorypurchase'
        })
        .populate('branch')
        .sort({createdAt:-1})

        return res.status(200).json({message:"All transaction retrived successfully.",success:true,data:transactions})

    }catch(err){
        next(err)
    }
}