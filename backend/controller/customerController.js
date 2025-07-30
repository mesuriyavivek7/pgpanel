import BRANCH from "../models/BRANCH.js";
import CUSTOMER from "../models/CUSTOMER.js";
import ROOM from "../models/ROOM.js";

export const createCustomer = async (req, res, next) =>{
    try{
        const {mongoid, userType} = req
        const {customer_name, mobile_no, deposite_amount, room, branch, joining_date} = req.body 
      
        if(!customer_name || !mobile_no || !deposite_amount || !room || !branch || !joining_date) return res.status(400).json({message:"Please provide all required fields.",success:false})

        const existCustomer = await CUSTOMER.findOne({mobile_no})

        if(existCustomer) return res.status(409).json({message:"Customer is already exist same mobile no.",success:false})

        const existRoom = await ROOM.findById(room)

        if(!existRoom) return res.status(404).json({message:"Room not found.",success:false})

        const existBranch = await BRANCH.findById(branch)

        if(!existBranch) return res.status(404).json({message:"Branch is not found",success:false})

        if(existRoom.filled >= existRoom.capacity) return res.status(400).json({message:"Room is already full. Cannot add more customers.",success:false})

        const newCustomer = await CUSTOMER({
            customer_name,
            mobile_no,
            deposite_amount,
            room,
            joining_date,
            branch,
            added_by:mongoid,
            added_by_type:userType
        })

        existRoom.filled = existRoom.filled + 1

        await existRoom.save()
        await newCustomer.save()

        return res.status(200).json({message:"New customer created successfully.",success:true,data:newCustomer})

    }catch(err){
        next(err)
    }
}

export const getAllCustomer = async (req, res, next) => {
    try {
      const { searchQuery, branch } = req.query;
  
      const filter = {};
  
      if (searchQuery) {
        filter.customer_name = { $regex: searchQuery, $options: 'i' };
      }
  
      if (branch) {
        filter.branch = branch;
      }
  
      const customers = await CUSTOMER.find(filter)
        .populate('room')
        .populate('branch')
        .populate('added_by') 
        .sort({ createdAt: -1 }); 
  
      res.status(200).json({message:"All customer details retrived.",data:customers,success:true});
    } catch (err) {
      next(err);
    }
};

export const getCustomerByRoomId = async (req, res, next) =>{
    try{
        const {roomId} = req.params
        if(!roomId) return res.status(400).json({message:"Please provide room id.",success:false})
        const {searchQuery} = req.query

        const filter = {}

        if(searchQuery) filter.customer_name = searchQuery
        filter.room = roomId

        const customers = await CUSTOMER.find(filter).sort({createdAt: -1});

        return res.status(200).json({message:"All customer details retrived by room id",success:true,data:customers})

    }catch(err){
        next(err)
    }
}

export const getCustomerByBranchId = async (req, res, next) =>{
    try{
       const {branchId} = req.params

       if(!branchId) return res.status(400).json({message:"Please provide branch id.",success:false})

       const {searchQuery} = req.query
       const filter = {}

       if(searchQuery) filter.customer_name = searchQuery
       filter.branch = branchId

       const customers = await CUSTOMER.find(filter).sort({createdAt:-1});

       return res.status(200).json({message:"All customer details retrived by branch id.",success:true,data:customers})

    }catch(err){
        next(err)
    }
}

export const updateCustomerDetails = async (req, res, next) =>{
    try{
        const {customerId} = req.params

        const {customer_name, mobile_no, deposite_amount, room, branch, joining_date} = req.body

        if(!customerId) return res.status(400).json({message:"Please provide customer id.",success:false})

        const customer = await CUSTOMER.findById(customerId)

        if(!customer) return res.status(404).json({message:"Customer not found.",success:false})

        if(mobile_no && mobile_no !== customer.mobile_no){
            const existCustomer = await CUSTOMER.findOne({mobile_no})

            if(existCustomer) return res.status(409).json({message:"Customer is already exist with same mobileno.",success:false})

            customer.mobile_no = mobile_no
        }

        if(customer_name) customer.customer_name = customer_name
        if(mobile_no) customer.deposite_amount = deposite_amount
        if(room) customer.room = room
        if(branch) customer.branch = branch
        if(joining_date) customer.joining_date = joining_date

        await customer.save()

        return res.status(200).json({message:"Customer details updated successfully.",success:true})

    }catch(err){
        next(err)
    }
}


export const changeStatus = async (req, res, next) =>{
    try{
        const {customerId} = req.params

        const {status} = req.body

        if(!customerId || status===undefined) return res.status(400).json({message:"Please provide customer id and status",success:false})

        const customer = await CUSTOMER.findById(customerId)

        if(!customer) return res.status(404).json({message:"Customer not found.",success:false})

        customer.status = status

        await customer.save()

        return res.status(200).json({message:"Customer status changed successfully",success:true})


    }catch(err){
        next(err)
    }
}