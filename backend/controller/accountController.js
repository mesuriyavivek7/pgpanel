import ACCOUNT from "../models/ACCOUNT.js";
import LOGINMAPPING from "../models/LOGINMAPPING.js";
import bcryptjs from 'bcryptjs'

export const createAccountManager = async (req, res, next) =>{
    try{
        const {mongoid} = req

        const {full_name, contact_no, email, branch, password} = req.body 
        
        if(!full_name || !contact_no || !email || !branch || (branch && branch.length === 0) || !password) return res.status(200).json({message:"Please provide all required fields.",success:false})

        const existAcContactNo = await ACCOUNT.findOne({contact_no})

        if(existAcContactNo) return res.status(409).json({message:"Account manager is already exist with same mobile no.",success:false})

        const existAcEmail = await LOGINMAPPING.findOne({email})

        if(existAcEmail) return res.status(409).json({message:"User is already exist with same email address.",success:false})

        const saltRounds = 10;
        const hashedPassword = await bcryptjs.hash(password, saltRounds);

        const newAcmanager = new ACCOUNT({
            full_name,
            contact_no,
            email,
            branch,
            added_by:mongoid
        })

        await newAcmanager.save()

        const newLoginMapping = new LOGINMAPPING({
            mongoid:newAcmanager._id,
            email,
            password:hashedPassword,
            userType:'Account',
        })

        await newLoginMapping.save()

        return res.status(200).json({message:"New account manager created succcessfully.",success:true})
        
    }catch(err){
        next(err)
    }
}


export const getAllAcmanager = async (req, res, next) =>{
    try{
        const {searchQuery = '', branch = ''} = req.query 

        console.log(branch)

       const mappings = await LOGINMAPPING.find({userType:"Account"})
       .populate({
         path:'mongoid',
         model:"Account",
         populate:[
            {
                path:'branch',
                model:'Branch'
            },
            {
                path:"added_by",
                model:"Admin",
                select: 'full_name email createdAt updatedAt'
            }
         ]
       }).select('status mongoid')

       const filtered = mappings
       .filter((item) => {
         const nameMatch = item.mongoid?.full_name
           ?.toLowerCase()
           .includes(searchQuery.toLowerCase());
 
         const branchMatch = branch
           ? item.mongoid?.branch?.some(b => b._id.toString() === branch)
           : true;
 
         return nameMatch && branchMatch;
       })
       .map((item) => {
         const account = item.mongoid?.toObject(); // Convert mongoose doc to plain object
 
         if (!account) return null;
 
         return {
           ...account,
           status: item.status,
         };
       })
       .filter(Boolean); // remove nulls

       return res.status(200).json({message:"All acmanager retrived successfully.",success:true,data:filtered})
        
    }catch(err){
        next(err)
    }
}


export const updateAcManager = async (req, res, next) =>{
    try{
        const {acmanagerId} = req.params

        if(!acmanagerId) return res.status(400).json({message:"Please provide acmanager id.",success:false})

        const {full_name, contact_no, email, branch} = req.body

        const acmanager = await ACCOUNT.findById(acmanagerId)

        if(!acmanager) return res.status(404).json({message:"Acmanager not found.",success:false})

        if(contact_no && acmanager.contact_no !== contact_no){
            const existAcmanager = await ACCOUNT.findOne({contact_no})

            if(existAcmanager) return res.status(409).json({message:"Account mamanager is already exist same mobile no.",success:false})

            acmanager.contact_no = contact_no
        }

        if(email && acmanager.email !== email) {
            const existUser = await LOGINMAPPING.findOne({email})

            if(existUser) return res.status(409).json({message:"User is already exist with same mobileno.",success:false})

            acmanager.email = email
        }

        if(full_name) acmanager.full_name = full_name
        if(branch) acmanager.branch = branch

        await acmanager.save()

        return res.status(200).json({message:"Acmanager details updated successfully.",success:true, data:acmanager})

    }catch(err){
        next(err)
    }
}

export const changeAcmanagerStatus = async (req, res, next) =>{
    try{
        const {acmanagerId} = req.params

        const {status} = req.body

        if(!acmanagerId || status===undefined) return res.status(400).json({message:"Please provide all required fields",success:false})

        const acmanager = await LOGINMAPPING.findOne({mongoid:acmanagerId})

        if(!acmanager) return res.status(404).json({message:"Acmanager not found.",success:false})

        acmanager.status = status

        await acmanager.save()

        return res.status(200).json({message:"Acmanager status changed successfully.",success:true})

    }catch(err){
        next(err)
    }
}