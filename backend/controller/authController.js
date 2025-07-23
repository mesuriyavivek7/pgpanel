import LOGINMAPPING from "../models/LOGINMAPPING.js";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import ADMIN from "../models/ADMIN.js";
import ACCOUNT from "../models/ACCOUNT.js";

//For login user 
export const loginUser = async (req, res, next) =>{
    try{
      const {email, password, userType} = req.body

      if(!email || !password || !userType) return res.status(200).json({message:"Please provide all required fields.",success:false})

      const user = await LOGINMAPPING.findOne({email, userType})

      if(!user) return res.status(404).json({message:"User not found.",success:false})

      if(!user.status) return res.status(404).json({message:"User is not active.",success:false})

      const isPasswordMatched = await bcryptjs.compare(password,user.password)

      if(!isPasswordMatched) return res.status(401).json({message:"Password is incorrect.",success:false})

      const token = jwt.sign({mongoid:user.mongoid, userType:user.userType}, process.env.JWT, {expiresIn:'7d'})

      res.cookie('pgtoken', token, {
        expires: new Date(Date.now() + 2592000000),
        httpOnly: true,
        domain:
         process.env.NODE_ENV === "production" ? ".digitallaundry.co.in" : undefined,
         secure: process.env.NODE_ENV === "production",
         sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });

      return res.status(200).json({message:'Login Successfully',data:{token,userId:user.mongoid,userType:user.userType}, success:true})

    }catch(err){
      next(err)
    }
}


export const validateToken = async (req, res, next) =>{
     try{
       const token = req.cookies.pgtoken

       if(!token) return res.status(401).json({message:"No Token Found.",success:false})

       const decoded = jwt.verify(token, process.env.JWT)

       const user = await LOGINMAPPING.findOne({mongoid:decoded.mongoid})

       if(!user) return res.status(404).json({message:"User not found.",success:false})

       if(!user.status) return res.status(400).json({message:"User is not active.",success:false})

       return res.status(200).json({message:"Token validate successfully.",data:{token, userId:user.mongoid, userType:user.userType},success:true})

     }catch(err){
        next(err)
     }
}

export const signupUser = async (req, res, next) =>{
    try{
        const {full_name, email, password , userType, contact_no} = req.body

        if(!full_name || !email || !password || !userType) return res.status(400).json({message:"Please provide all required fields."})

        const existUser = await LOGINMAPPING.findOne({email})

        if(existUser) return res.status(409).json({message:"Email address is already exist.",success:false})

        const saltRounds = 10;
        const hashedPassword = await bcryptjs.hash(password, saltRounds);

        let newUser = null
        if(userType === 'Admin'){
            newUser = new ADMIN({
                email,
                full_name,
            })
        }else if(userType === 'Account'){
            newUser = new ACCOUNT({
                full_name,
                contact_no,
                email
            })
        }else{
            return res.status(400).json({message:"Please provide valid user type.",success:false})
        }

        await newUser.save()


        const newLogin = new LOGINMAPPING({
            mongoid:newUser._id,
            email,
            password:hashedPassword,
            userType
        })
        
        await newLogin.save()

        return res.status(200).json({message:"New user created successfully.",success:true,data:newUser})


    }catch(err){
        next(err)
    }
} 


export const logoutPortal = async (req, res, next) =>{
    try {
      res.clearCookie("pgtoken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        domain: process.env.NODE_ENV === "production" ? ".digitallaundry.co.in" : undefined,
      });
  
      return res.status(200).json({ message: "Logout successful", status: 200 });
    } catch (err) {
      next(err);
    }
  }
  