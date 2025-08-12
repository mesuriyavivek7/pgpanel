import TRANSACTION from "../models/TRANSACTION.js";
import CASHOUT from "../models/CASHOUT.js";


export const getAllCashOutTransaction = async (req, res, next) =>{
    try{
        const {searchQuery} = req.query
        
        const filter = {
            type:'cash_given'
        }

        let cashoutIds = []
        if(searchQuery) {
            const cashoutDocs = await CASHOUT.find({
                 person_name: {$regex: searchQuery, $options: 'i'}
            }).select('_id')

            cashoutIds = cashoutDocs.map(doc => doc._id)

            filter.refId = {$in : cashoutIds}
        }

        const transactions = await TRANSACTION.find(filter)
        .populate({
            path:'refId',
            model:'Cashout'
        }).sort({createdAt: -1})

        return res.status(200).json({message:"All cashout transaction retrived.", success:true, data:transactions})

    }catch(err){
        next(err)
    }
}