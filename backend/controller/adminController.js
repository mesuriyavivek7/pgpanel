import TRANSACTION from "../models/TRANSACTION.js"
import BANKACCOUNT from "../models/BANKACCOUNT.js"
import BRANCH from "../models/BRANCH.js"
import CUSTOMER from "../models/CUSTOMER.js"
import EMPLOYEE from "../models/EMPLOYEE.js"
import ACCOUNT from "../models/ACCOUNT.js"
import { getMonthShortNames } from "../helper.js"
import { removeFile } from "../utils/removeFile.js"
import ADMIN from "../models/ADMIN.js"
import LOGINMAPPING from "../models/LOGINMAPPING.js"
import bcryptjs from 'bcryptjs'
import ROOM from "../models/ROOM.js"

export const getDashboardSummery = async (req, res, next) =>{
    try{
        const currentYear = new Date().getFullYear()

        const totalEmployees = await EMPLOYEE.find({status:true}).countDocuments()
        const totalCustomers = await CUSTOMER.find({status:true}).countDocuments()
        const totalBranch = await BRANCH.find().countDocuments()
        const totalAcManagers = await LOGINMAPPING.find({status:true, userType:'Account'}).countDocuments()
        const vacantSeats = await ROOM.aggregate([
            {
              $group: {
                _id: null,
                totalVacant: { $sum: { $subtract: ["$capacity", "$filled"] } }
              }
            }
        ]);
        

        const transactions = await TRANSACTION.find()
        .populate('refId')
        .populate('bank_account')

        let monthlyData = Array.from({length: 12}, (_, i)=> ({
            month:getMonthShortNames(i + 1),
            Profit: 0,
            Expenditure:0,
        }))

        let yearlyMap = {};
        let totalProfit = 0;
        let totalExpenditure = 0;
        let totalCurrentYearProfit = 0;
        let totalCurrentYearExpenditure = 0;

        transactions.forEach(tx => {
            if(!tx.refId || !tx.refId.amount) return 
            const amount = tx.refId.amount
            const createdAt = tx.createdAt 
            const month = createdAt.getMonth() + 1
            const year = createdAt.getFullYear() 

            //Monthly
            if(tx.transactionType === "income"){
                monthlyData[month - 1].Profit += amount
                totalProfit += amount
                if(currentYear === year) totalCurrentYearProfit += amount
            }else if(tx.transactionType === "expense"){
                monthlyData[month -1].Expenditure += amount
                totalExpenditure += amount
                if(currentYear === year) totalCurrentYearExpenditure += amount
            }

            //Yearly
            if(!yearlyMap[year]){
                yearlyMap[year] = {year, Profit:0, Expenditure:0}
            }

            if(tx.transactionType === "income"){
                yearlyMap[year].Profit += amount
            }else{
                yearlyMap[year].Expenditure += amount
            }
        })

        let yearlyData = [];
        for(let y = currentYear; y > currentYear - 5; y--){
            yearlyData.push({
                year: y,
                Profit: yearlyMap[y]?.Profit || 0,
                Expenditure: yearlyMap[y]?.Expenditure || 0
            });
        }

        //Get BANK ACCOUNTS
        const accounts = await BANKACCOUNT.find();

        const accountsData = accounts.map(acc => {
            const accTx = transactions.filter(t => 
            t.bank_account && t.bank_account._id.toString() === acc._id.toString())

            let balance = 0;
            accTx.forEach(tx => {
                if(!tx.refId?.amount) return 
                if(tx.transactionType === "income"){
                    balance += tx.refId.amount
                }else{
                    balance -= tx.refId.amount
                }
            });

            return {
                account_holdername: acc.account_holdername,
                current_balance: balance
            }
        })

        const current_balance = totalProfit - totalExpenditure

        return res.status(200).json({data:{
            monthlyData,
            yearlyData,
            current_balance,
            total_profit: totalProfit,
            total_expenditure: totalExpenditure,
            total_current_year_profit: totalCurrentYearProfit,
            total_current_year_expenditure: totalCurrentYearExpenditure,
            accounts: accountsData,
            totalBranch,
            totalCustomers,
            totalEmployees,
            totalAcManagers,
            vacantSeats:vacantSeats.length > 0 ? vacantSeats[0].totalVacant : 0
        },message:"Dashboard summery retrived successfully.",success:true})

    }catch(err){
        next(err)
    }
}


export const getDashboardSearch = async (req, res, next) =>{
    try{
        const {searchQuery} = req.query

        const {role} = req.params
        let results = []

        if(!searchQuery) return res.status(200).json({message:"Provide searchquery to get data.",data:[],success:true})

        switch(role){
            case 'Customers': {
              results = await CUSTOMER.find({
                $or: [
                  { customer_name: { $regex: searchQuery, $options: 'i' } },
                  { mobile_no: { $regex: searchQuery, $options: 'i' } }
                ],
                status:true
              }).populate('room').populate('branch')
            }
            break;

            case 'Employees': {
               results = await EMPLOYEE.find({
                $or: [
                  { employee_name: { $regex: searchQuery, $options: 'i' } },
                  { mobile_no: { $regex: searchQuery, $options: 'i' } }
                ],
                status:true
               }).populate('branch')
            }   
            break;      

            case 'Ac Managers': {
               results = await ACCOUNT.find({
                $or: [
                  { full_name: { $regex: searchQuery, $options: 'i' } },
                  { contact_no: { $regex: searchQuery, $options: 'i' } },
                  { email: { $regex: searchQuery, $options: 'i' } }
                ],
            }).populate('branch')
            }   
            break;

            default: {
                return res.status(400).json({data:null,message:"Invalid role.",success:false})
            }
        }

        return res.status(200).json({message:"All search query results retrived successfully.",data:results,success:true})

    }catch(err){
        next(err)
    }
}

export const getAdminDetails = async (req, res, next) =>{
    try{
       const {mongoid} = req 

       const admin = await ADMIN.findById(mongoid)

       return res.status(200).json({message:"Admin details retrival successfully.",data:admin,success:true})

    }catch(err){
        next(err)
    }
}

export const uploadLogo = async (req, res, next) => {
    try{
        const {mongoid} = req 
        
        const admin = await ADMIN.findById(mongoid) 

        if(!admin){
           await removeFile(path.join('uploads',"branch", req.file.filename))
           return res.status(404).json({message:"Admin not found.",success:false})
        } 

        if(admin.pglogo){
           const filePath = admin.pglogo.replace(process.env.DOMAIN, "")
           await removeFile(filePath)
        }

        let imageUrl = null 
        
        imageUrl = `${process.env.DOMAIN}/uploads/logo/${req.file.filename}`

        admin.pglogo = imageUrl 

        await admin.save()

        return res.status(200).json({message:"Logo uploaded successfully.",success:true})
        
    }catch(err){
        next(err)
    }
}

export const updateAdminDetails = async (req, res, next) =>{
    try{
        const {mongoid} = req  

        const admin = await ADMIN.findById(mongoid) 

        if(!admin) return res.status(404).json({message:"Admin not found.",success:false})

        const {full_name, email} = req.body 
    
        if(email && admin.email !== email) {
          const existUser = await LOGINMAPPING.findOne({email})

          if(existUser) return res.status(409).json({message:"User is already exist with same email address.",success:false})
        }

        await LOGINMAPPING.findOneAndUpdate({mongoid}, {$set:{email:email}})

        admin.full_name = full_name 
        admin.email = email 

        await admin.save() 

        return res.status(200).json({message:"Admin details updated successfully.",success:true})

    }catch(err){
        next(err)
    }
}


export const changePassword = async (req, res, next) =>{
    try{
       const {mongoid} = req 

       const {password, current_password} = req.body 

       if(!password || !current_password) return res.status(400).json({message:"Please provide all required fields.",success:false})

       const loginmapping = await LOGINMAPPING.findOne({mongoid})

       if(!loginmapping) return res.status(404).json({message:"Admin not found.",success:false})
 
       const isMatch = await bcryptjs.compare(current_password, loginmapping.password) 
       if(!isMatch) return res.status(401).json({message:"Current password is incorrect.",success:false})

       const salt = await bcryptjs.genSalt(10);
       const hashedPassword = await bcryptjs.hash(password, salt);

       loginmapping.password = hashedPassword
       await loginmapping.save() 

       return res.status(200).json({message:"Password changed successfully.",success:true})

    }catch(err){
        next(err)
    }
}