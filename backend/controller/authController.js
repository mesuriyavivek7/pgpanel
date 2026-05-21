import LOGINMAPPING from "../models/LOGINMAPPING.js";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import ADMIN from "../models/ADMIN.js";
import ACCOUNT from "../models/ACCOUNT.js";
import OTP from "../models/OTP.js";
import { sendOtpEmail } from "../utils/emailService.js";

//For login user (Step 1 - validate credentials and send OTP)
export const loginUser = async (req, res, next) =>{
    try{
      const {email, password, userType} = req.body

      if(!email || !password || !userType) return res.status(400).json({message:"Please provide all required fields.",success:false})

      const user = await LOGINMAPPING.findOne({email, userType})

      if(!user) return res.status(404).json({message:"User not found.",success:false})

      if(!user.status) return res.status(400).json({message:"User is not active.",success:false})

      const isPasswordMatched = await bcryptjs.compare(password, user.password)

      if(!isPasswordMatched) return res.status(401).json({message:"Password is incorrect.",success:false})

      // Generate 6-digit OTP
      const rawOtp = Math.floor(100000 + Math.random() * 900000).toString()
      const saltRounds = 10
      const hashedOtp = await bcryptjs.hash(rawOtp, saltRounds)

      // Remove any existing OTP for this email+userType
      await OTP.deleteMany({ email: email.toLowerCase(), userType })

      // Save new OTP
      await OTP.create({ email: email.toLowerCase(), otp: hashedOtp, userType })

      // Send OTP via email
      await sendOtpEmail(email, rawOtp)

      return res.status(200).json({
        message: 'OTP sent to your email address.',
        data: { requires2FA: true, email },
        success: true,
      })

    }catch(err){
      next(err)
    }
}

//For verify OTP (Step 2 - verify OTP and issue session cookie)
export const verifyOtp = async (req, res, next) => {
    try {
        const { email, otp, userType } = req.body

        if (!email || !otp || !userType) return res.status(400).json({ message: "Please provide all required fields.", success: false })

        const otpRecord = await OTP.findOne({ email: email.toLowerCase(), userType })

        if (!otpRecord) return res.status(400).json({ message: "OTP expired or not found. Please login again.", success: false })

        const isOtpValid = await bcryptjs.compare(otp, otpRecord.otp)

        if (!isOtpValid) return res.status(401).json({ message: "Invalid OTP. Please try again.", success: false })

        // OTP verified — clean up
        await OTP.deleteMany({ email: email.toLowerCase(), userType })

        const user = await LOGINMAPPING.findOne({ email: email.toLowerCase(), userType })

        if (!user) return res.status(404).json({ message: "User not found.", success: false })

        if (!user.status) return res.status(400).json({ message: "User is not active.", success: false })

        const token = jwt.sign({ mongoid: user.mongoid, userType: user.userType }, process.env.JWT, { expiresIn: '7d' })

        res.cookie('pgtoken', token, {
            expires: new Date(Date.now() + 2592000000),
            httpOnly: true,
            domain: process.env.NODE_ENV === "production" ? ".harikrushnapg.com" : undefined,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        })

        return res.status(200).json({
            message: 'Login Successfully',
            data: { token, userId: user.mongoid, userType: user.userType },
            success: true,
        })

    } catch (err) {
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
        domain: process.env.NODE_ENV === "production" ? ".harikrushnapg.com" : undefined,
      });
  
      return res.status(200).json({ message: "Logout successful", status: 200 });
    } catch (err) {
      next(err);
    }
  }
  