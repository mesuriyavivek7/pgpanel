import BRANCH from "../models/BRANCH.js";
import CUSTOMER from "../models/CUSTOMER.js";
import ROOM from "../models/ROOM.js";
import TRANSACTION from "../models/TRANSACTION.js";
import ACCOUNT from "../models/ACCOUNT.js";
import DEPOSITEAMOUNT from "../models/DEPOSITEAMOUNT.js";
import CUSTOMERRENT from "../models/CUSTOMERRENT.js";
import mongoose from "mongoose";

export const createCustomer = async (req, res, next) => {
    try {
        const { mongoid, userType } = req
        const { customer_name, mobile_no, deposite_amount, variable_deposite_amount, rent_amount, room, branch, joining_date, bank_account, payment_mode, isAdvance, replaceCustomer } = req.body

        if(isAdvance && isAdvance === true){
            if(!replaceCustomer){
                return res.status(400).json({message:"Please provide replace customer for advance rent customer.",success:false})
            }
    
            const existingCustomer = await CUSTOMER.findById(replaceCustomer)
    
            if(!existingCustomer){
                return res.status(404).json({message:"Replace customer not found.",success:false})
            }
    
            if(!existingCustomer.in_notice_period){
                return res.status(400).json({message:"Replace customer is not in notice period.",success:false})
            }
        }

        if(variable_deposite_amount > deposite_amount){
            return res.status(400).json({message:"Variable deposite amount cannot be greater than deposite amount.",success:false})
        }

        if(userType === "Account"){
            const account = await ACCOUNT.findById(mongoid)

            if(account && !account.branch.includes(branch)) return res.status(403).json({message:'You have not access to create customer on this branch.',success:false})
        }

        if (!customer_name || !mobile_no || !deposite_amount || !rent_amount || !room || !branch || !joining_date) return res.status(400).json({ message: "Please provide all required fields.", success: false })

        const existCustomer = await CUSTOMER.findOne({ mobile_no })

        if (existCustomer) return res.status(409).json({ message: "Customer is already exist same mobile no.", success: false })

        const existRoom = await ROOM.findById(room)

        if (!existRoom) return res.status(404).json({ message: "Room not found.", success: false })

        const existBranch = await BRANCH.findById(branch)

        if (!existBranch) return res.status(404).json({ message: "Branch is not found", success: false })

        if(!isAdvance){
          if (existRoom.filled >= existRoom.capacity) return res.status(400).json({ message: "Room is already full. Cannot add more customers.", success: false })
        }

        let isDepositePaid = deposite_amount === variable_deposite_amount ? 'Paid' : 'Pending'
        
        //Create new customer
        const newCustomer = await CUSTOMER({
            customer_name,
            mobile_no,
            deposite_amount,
            paid_deposite_amount: variable_deposite_amount,
            deposite_status: isDepositePaid,
            rent_amount,
            room,
            joining_date,
            branch,
            added_by: mongoid,
            added_by_type: userType
        })

        if(variable_deposite_amount > 0){

          //Create new deposite
          const deposite = new DEPOSITEAMOUNT({   
            customer: newCustomer._id, 
            amount: variable_deposite_amount 
          })

          await deposite.save()

          //Create transaction for deposite amount
          const newTransaction = new TRANSACTION({
            transactionType: 'deposite',
            type: 'deposite',
            refModel: 'Depositeamount',
            refId: deposite._id,
            bank_account,
            branch,
            payment_mode,
          })

          await newTransaction.save()

        }

        let newCustomerRent = null
        if(isAdvance && isAdvance === true){
          newCustomerRent = new CUSTOMERRENT({
              customer: newCustomer._id,
              rent: rent_amount,
              paid_amount: 0,
              status:'Pending',
              month: new Date(joining_date).getMonth() + 1,
              year: new Date(joining_date).getFullYear()
          })
        }else{
           newCustomerRent = new CUSTOMERRENT({
              customer: newCustomer._id,
              rent: rent_amount,
              paid_amount: 0,
              status:'Pending',
              month: new Date().getMonth() + 1,
              year: new Date().getFullYear()
           })
        }

        if(!isAdvance) {
          existRoom.filled = existRoom.filled + 1
        }
        
        if(isAdvance && isAdvance === true){
            const replaceCust = await CUSTOMER.findById(replaceCustomer)
            replaceCust.customer_replaced = true
            await replaceCust.save()
        }
        
        await existRoom.save()
        await newCustomer.save()
        await newCustomerRent.save()

        return res.status(200).json({ message: "New customer created successfully.", success: true, data: newCustomer })

    } catch (err) {
        next(err)
    }
}

export const getAllCustomer = async (req, res, next) => {
    try {
      const { mongoid, userType } = req;
      const { searchQuery, branch, room } = req.query;
  
      const filter = {};
  
      // If user is Account type, restrict their access to allowed branches
      if (userType === "Account") {
        const account = await ACCOUNT.findById(mongoid);
  
        if (!account) {
          return res
            .status(404)
            .json({ message: "Account not found.", success: false });
        }
  
        // If a branch query param is passed, check access
        if (branch) {
          if (!account.branch.includes(branch)) {
            return res.status(403).json({
              message:
                "You do not have access to get customers for this branch.",
              success: false,
            });
          }
          filter.branch = branch; // Allowed branch
        } else {
          // If no branch query provided, restrict to account's accessible branches
          filter.branch = { $in: account.branch };
        }
      } else {
        // If not Account type, allow branch filter freely
        if (branch) {
          filter.branch = branch;
        }
      }
  
      // Search filter
      if (searchQuery) {
        filter.customer_name = { $regex: searchQuery, $options: "i" };
      }
  
      // Room filter
      if (room) {
        filter.room = room;
      }
  
      // Query DB
      const customers = await CUSTOMER.find(filter)
        .populate("room")
        .populate("branch")
        .populate("added_by")
        .sort({ createdAt: -1 });
  
      res.status(200).json({
        message: "All customer details retrieved.",
        data: customers,
        success: true,
      });
    } catch (err) {
      next(err);
    }
 };

export const getCustomerByRoomId = async (req, res, next) => {
    try {
        const {mongoid, userType} = req 

        const { roomId } = req.params
        if (!roomId) return res.status(400).json({ message: "Please provide room id.", success: false })

        const room = await ROOM.findById(roomId)

        if(!room) return res.status(404).json({message:"Room not found.",success:false})

        if(userType === "Account"){
            const account = await ACCOUNT.findById(mongoid) 

            if(!account) return res.status(404).json({message:"Account manager not found.",success:false})

            const branchIds = account.branch;

            if(!branchIds.includes(room.branch)) return res.status(403).json({message:"You have not access to get customer from this room.",success:false})
            
        }

        const { searchQuery } = req.query

        const filter = {}

        if (searchQuery) filter.customer_name = searchQuery
        filter.room = roomId

        const customers = await CUSTOMER.find(filter).sort({ createdAt: -1 });

        return res.status(200).json({ message: "All customer details retrived by room id", success: true, data: customers })

    } catch (err) {
        next(err)
    }
}

export const getCustomerByBranchId = async (req, res, next) => {
    try {
        const { branchId } = req.params

        const {mongoid, userType} = req

        if (!branchId) return res.status(400).json({ message: "Please provide branch id.", success: false })

        const branch = await BRANCH.findById(branchId)

        if(!branch) return res.status(404).json({message:"Branch not found.",success:false})

        if(userType === "Account") {
            const account = await ACCOUNT.findById(mongoid)

            if(!account) return res.status(404).json({message:"Account manager not found.",success:false})

            if(!account.branch.includes(branchId)) return res.status(403).json({message:"You have not access to get customer for this branch.",success:false})
        }

        const { searchQuery } = req.query
        const filter = {}

        if (searchQuery) filter.customer_name = searchQuery
        filter.branch = branchId

        const customers = await CUSTOMER.find(filter).sort({ createdAt: -1 });

        return res.status(200).json({ message: "All customer details retrived by branch id.", success: true, data: customers })

    } catch (err) {
        next(err)
    }
}

export const updateCustomerDetails = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { customerId } = req.params
        const {mongoid, userType} = req 

        const { customer_name, mobile_no, deposite_amount, room, branch, rent_amount, joining_date } = req.body

        if (!customerId){
           await session.abortTransaction();
           session.endSession();
           return res.status(400).json({ message: "Please provide customer id.", success: false })
        }

        const customer = await CUSTOMER.findById(customerId).session(session)

        if (!customer){
            await session.abortTransaction();
            session.endSession();
           return res.status(404).json({ message: "Customer not found.", success: false })
        }

        if(userType === "Account"){
            const account = await ACCOUNT.findById(mongoid).session(session) 

            if(!account){
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({message:"Account manager not found.",success:false})
            }

            if(!account.branch.includes(customer.branch)){
                await session.abortTransaction();
                session.endSession();
                return res.status(403).json({message:"You have not access to update this customer details.",success:false})
            }
        }

        if (mobile_no && mobile_no !== customer.mobile_no) {
            const existCustomer = await CUSTOMER.findOne({ mobile_no }).session(session)

            if (existCustomer){
                 await session.abortTransaction();
                 session.endSession();
                 return res.status(409).json({ message: "Customer is already exist with same mobileno.", success: false })
            }

            customer.mobile_no = mobile_no
        }

        if (customer_name) customer.customer_name = customer_name
        if (deposite_amount && deposite_amount !== customer.deposite_amount){
            if(deposite_amount < customer.deposite_amount){

                const defaultBankAccount = await BANKACCOUNT.findOne({is_default:true}).session(session)
      
                const newDepositeAmount = await DEPOSITEAMOUNT({
                  customer: customer._id,
                  amount: customer.deposite_amount - deposite_amount,
                })
                
                const newTransaction = await TRANSACTION({
                  transactionType: "withdrawal",
                  type: "deposite",
                  refModel: "Depositeamount",
                  refId: newDepositeAmount._id,
                  payment_mode: "cash",
                  status: "completed",
                  branch: customer.branch,
                  bank_account: defaultBankAccount ? defaultBankAccount._id : null,
                  pgcode,
                  added_by: mongoid,
                  added_by_type: userType,
                })
      
                await newDepositeAmount.save({session});
                await newTransaction.save({session});
      
             }else{
                customer.deposite_status = 'Pending'
             }
             customer.deposite_amount = deposite_amount;
        }

        if (rent_amount) {
            if (rent_amount < customer.rent_amount) {
              await session.abortTransaction();
              session.endSession();
              return res.status(400).json({
                message: "Rent amount cannot be less than previous rent amount.",
                success: false,
              });
            }
          
            customer.rent_amount = rent_amount;
          
            // Get current month & year
            const currentMonth = new Date().getMonth() + 1;
            const currentYear = new Date().getFullYear();
          
            // Find all future rent records for this customer (including current month)
            const futureRents = await CUSTOMERRENT.find({
              customer: customer._id,
              $or: [
                { year: { $gt: currentYear } },
                { year: currentYear, month: { $gte: currentMonth } },
              ],
            });
          
            if (futureRents.length > 0) {
              // Update rent for all matching documents
              await CUSTOMERRENT.updateMany(
                {
                  customer: customer._id,
                  $or: [
                    { year: { $gt: currentYear } },
                    { year: currentYear, month: { $gte: currentMonth } },
                  ],
                },
                {
                  $set: {
                    rent: rent_amount,
                    status: "Pending",
                  },
                },
                { session }
              );
            }
          
            // Save updated rent in customer record
            await customer.save({ session });
        }
          

        if (room && room.toString() !== customer.room.toString()){
            const oldRoomId = customer.room;
            const newRoomId = room;
      
            const oldRoom = oldRoomId
              ? await ROOM.findById(oldRoomId).session(session)
              : null;
            const newRoom = await ROOM.findById(newRoomId).session(session);
      
            if (!newRoom) {
              await session.abortTransaction();
              session.endSession();
              return res
                .status(400)
                .json({ message: "Selected room is not found.", success: false });
            }
            
            if (newRoom.filled >= newRoom.capacity) {
                await session.abortTransaction();
                session.endSession();
                return res
                  .status(400)
                  .json({ message: "New room is already full.", success: false });
            }

            if (oldRoom) {
                await ROOM.findByIdAndUpdate(
                  oldRoom._id,
                  { $inc: { filled: -1 } },
                  { session }
                );
            }

            await ROOM.findByIdAndUpdate(
                newRoom._id,
                { $inc: { filled: 1 } },
                { session }
            );
        
            customer.room = room
        }

        if (branch){
            const existBranch = await BRANCH.findById(branch).session(session);
            if (!existBranch) {
            await session.abortTransaction();
            session.endSession();
            return res
             .status(400)
             .json({ message: "Selected branch is not found.", success: false });
            }
            customer.branch = branch;
        }

        if (joining_date) customer.joining_date = joining_date

        await customer.save({session})

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({ message: "Customer details updated successfully.", success: true })

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        next(err)
    }
}


export const changeStatus = async (req, res, next) => {
    try {
        const { customerId } = req.params
        const {mongoid, userType} = req 

        const { status } = req.body

        if (!customerId || status === undefined) return res.status(400).json({ message: "Please provide customer id and status", success: false })

        const customer = await CUSTOMER.findById(customerId)

        if (!customer) return res.status(404).json({ message: "Customer not found.", success: false })

        if(userType === "Account"){
            const account = await ACCOUNT.findById(mongoid) 

            if(!account) return res.status(404).json({message:"Account manager not found.",success:false})

            if(!account.branch.includes(customer.branch)) return res.status(403).json({message:"You have not access to update this customer details.",success:false})
        }

        const room = await ROOM.findById(customer.room)
    
        if (!room) return res.status(200).json({ message: "Customer room is missing.", success: false })

        if(status){
           if(!customer.customer_replaced){
            if(room.filled >= room.capacity){
                return res.status(400).json({ message: "Room is already full. Cannot activate customer.", success: false })
            }

            room.filled = room.filled + 1

            await room.save()
           }
        }else{
            if(!customer.customer_replaced){
                room.filled = room.filled - 1
        
                await room.save()
            }
        }

        customer.status = status

        await customer.save()

        return res.status(200).json({ message: "Customer status changed successfully", success: true })


    } catch (err) {
        next(err)
    }
}

// export const getPendingCustomerRentList = async (req, res, next) => {
//     try {
//         const { searchQuery, branch } = req.query
//         const {mongoid, userType} = req
//         let filter = {
//             status: true
//         }

//         if (searchQuery) {
//             filter.customer_name = { $regex: searchQuery, $options: 'i' };
//         }

//         if(userType === "Account"){
//             const account = await ACCOUNT.findById(mongoid) 

//             if(!account) return res.status(400).json({message:"Account manager not found.",success:false})

//             if(branch) {
//                 if(!account.branch.includes(branch)) return res.status(403).json({message:"You have no access to get pending rents of requested branch.",success:false})

//                 filter.branch = branch
//             }else{
//                 filter.branch = { $in: account.branch };
//             }
//         }else {
//             if(branch){
//                 filter.branch = branch
//             }
//         }

//         const customers = await CUSTOMER.find(filter)
//             .populate('branch')
//             .populate('room')

//         const result = []

//         for (const customer of customers) {
//             const monthList = getMonthYearList(customer.joining_date)

//             const rentTransaction = await TRANSACTION.find({
//                 transactionType: 'income',
//                 type: 'customer_rent',
//                 refModel: 'Customerrent',
//                 branch: customer.branch._id
//             }).populate({
//                 path: 'refId',
//                 model: 'Customerrent',
//                 match: { customer: customer._id }
//             })

//             const paidRentMap = {}

//             for (const tx of rentTransaction) {
//                 const entry = tx.refId;
//                 if (!entry) continue;

//                 const key = `${entry.month}-${entry.year}`;
//                 if (!paidRentMap[key]) {
//                     paidRentMap[key] = 0
//                 }

//                 paidRentMap[key] += entry.amount;
//             }

//             const pendingRent = [];

//             for (const { month, year } of monthList) {
//                 const key = `${month}-${year}`
//                 const paid = paidRentMap[key] || 0
//                 const pending = Math.max(customer.rent_amount - paid, 0)

//                 if (pending > 0) {
//                     const today = new Date();
//                     const currentMonth = today.getMonth() + 1;
//                     const currentYear = today.getFullYear()

//                     const isRequired = !(month === currentMonth && year === currentYear)

//                     pendingRent.push({
//                         month,
//                         year,
//                         pending,
//                         required: isRequired
//                     })
//                 }
//             }

//             if (pendingRent.length > 0) {
//                 result.push({
//                     customerId: customer._id,
//                     customer_name: customer.customer_name,
//                     branch: customer.branch,
//                     room: customer.room,
//                     mobile_no: customer.mobile_no,
//                     rent_amount: customer.rent_amount,
//                     pending_rent: pendingRent
//                 })
//             }

//         }

//         return res.status(200).json({ message: "Pending customer list fetched successfully.", success: true, data: result })

//     } catch (err) {
//         next(err)
//     }
// }

export const getPendingCustomerRentList = async (req, res, next) =>{
    try{
        const { searchQuery, branch } = req.query 

        const {mongoid, userType} = req 
        let filter = {
            status: true 
        }

        if(searchQuery){
            filter.customer_name = { $regex: searchQuery, $options: 'i' };
        }

        if(userType === "Account"){
            const account = await ACCOUNT.findById(mongoid) 

            if(!account) return res.status(400).json({message:"Account manager not found.",success:false})

            if(branch) {
                if(!account.branch.includes(branch)) return res.status(403).json({message:"You have no access to get pending rents of requested branch.",success:false})

                filter.branch = branch
            }else{
                filter.branch = { $in: account.branch };
            }
        }else {
            if(branch){
                filter.branch = branch
            }
        }

        const customers = await CUSTOMER.find(filter)
            .populate('branch')
            .populate('room')
            .sort({createdAt:-1})

        const result = [] 

        for (const customer of customers){
            const pendingRents = await CUSTOMERRENT.find({customer: customer._id, status:'Pending'})

            const pendingRentMap = [] 

            for(const customerRent of pendingRents){
                const isRequired = !(customerRent.month === (new Date().getMonth() + 1) && customerRent.year === new Date().getFullYear())
                pendingRentMap.push({
                    month:customerRent.month,
                    year:customerRent.year,
                    pending: customerRent.rent - customerRent.paid_amount,
                    required:isRequired
                })
            }

            if(pendingRentMap.length > 0){
                result.push({
                    customerId: customer._id,
                    customer_name: customer.customer_name,
                    branch: customer.branch,
                    room: customer.room,
                    mobile_no: customer.mobile_no,
                    rent_amount: customer.rent_amount,
                    pending_rent: pendingRentMap
                })
            }

        }

        return res.status(200).json({ message: "Pending customer list fetched successfully.", success: true, data: result })

    }catch(err){
        next(err)
    }
}