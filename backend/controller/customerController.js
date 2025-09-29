import BRANCH from "../models/BRANCH.js";
import CUSTOMER from "../models/CUSTOMER.js";
import ROOM from "../models/ROOM.js";
import TRANSACTION from "../models/TRANSACTION.js";
import ACCOUNT from "../models/ACCOUNT.js";
import DEPOSITEAMOUNT from "../models/DEPOSITEAMOUNT.js";
import CUSTOMERRENT from "../models/CUSTOMERRENT.js";

export const createCustomer = async (req, res, next) => {
    try {
        const { mongoid, userType } = req
        const { customer_name, mobile_no, deposite_amount, rent_amount, room, branch, joining_date, bank_account, payment_mode } = req.body

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

        if (existRoom.filled >= existRoom.capacity) return res.status(400).json({ message: "Room is already full. Cannot add more customers.", success: false })

        //Create new customer
        const newCustomer = await CUSTOMER({
            customer_name,
            mobile_no,
            deposite_amount,
            rent_amount,
            room,
            joining_date,
            branch,
            added_by: mongoid,
            added_by_type: userType
        })

        //Create new deposite
        const deposite = new DEPOSITEAMOUNT({   
            customer: newCustomer._id, 
            amount: deposite_amount 
        })

        await deposite.save()

        //Create transaction for deposite amount
        const newTransaction = new TRANSACTION({
            transactionType: 'income',
            type: 'deposite',
            refModel: 'Depositeamount',
            refId: deposite._id,
            bank_account,
            branch,
            payment_mode,
        })

        //Create customer rent for current month with paid amount = 0
        const newCustomerRent = new CUSTOMERRENT({
            customer: newCustomer._id,
            rent: rent_amount,
            paid_amount: 0,
            status:'Pending',
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear()
        })


        existRoom.filled = existRoom.filled + 1

        await existRoom.save()
        await newCustomer.save()
        await newTransaction.save()
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
    try {
        const { customerId } = req.params
        const {mongoid, userType} = req 

        const { customer_name, mobile_no, deposite_amount, room, branch, rent_amount, joining_date } = req.body

        if (!customerId) return res.status(400).json({ message: "Please provide customer id.", success: false })

        const customer = await CUSTOMER.findById(customerId)

        if (!customer) return res.status(404).json({ message: "Customer not found.", success: false })

        if(userType === "Account"){
            const account = await ACCOUNT.findById(mongoid) 

            if(!account) return res.status(404).json({message:"Account manager not found.",success:false})

            if(!account.branch.includes(customer.branch)) return res.status(403).json({message:"You have not access to update this customer details.",success:false})
        }

        if (mobile_no && mobile_no !== customer.mobile_no) {
            const existCustomer = await CUSTOMER.findOne({ mobile_no })

            if (existCustomer) return res.status(409).json({ message: "Customer is already exist with same mobileno.", success: false })

            customer.mobile_no = mobile_no
        }

        if (customer_name) customer.customer_name = customer_name
        if (deposite_amount){

            const customerDeposite = await DEPOSITEAMOUNT.findOne({customer: customerId})

            if(!customerDeposite) {

                const newDeposite = new DEPOSITEAMOUNT({
                    customer: customerId,
                    amount: deposite_amount
                })

                await newDeposite.save()
            }else{
                customerDeposite.amount = deposite_amount
                await customerDeposite.save()
            }

            customer.deposite_amount = deposite_amount
        }
        if(rent_amount) {

            //HERE ADD LOGIC TO UPDATE CUSTOMER RENT IF MONTHLY RENT IS CHANGE
            // const month = new Date().getMonth() + 1
            // const year = new Date().getFullYear()
            // const customerRent = await CUSTOMERRENT.findOne({customer: customerId, month, year})

            customer.rent_amount = rent_amount
        }
        if (room) customer.room = room
        if (branch) customer.branch = branch
        if (joining_date) customer.joining_date = joining_date

        await customer.save()

        return res.status(200).json({ message: "Customer details updated successfully.", success: true })

    } catch (err) {
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

        room.filled = room.filled - 1

        customer.status = status

        await room.save()
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