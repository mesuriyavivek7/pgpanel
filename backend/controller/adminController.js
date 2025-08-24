import TRANSACTION from "../models/TRANSACTION.js"
import BANKACCOUNT from "../models/BANKACCOUNT.js"
import BRANCH from "../models/BRANCH.js"
import CUSTOMER from "../models/CUSTOMER.js"
import EMPLOYEE from "../models/EMPLOYEE.js"
import ACCOUNT from "../models/ACCOUNT.js"
import { getMonthShortNames } from "../helper.js"

export const getDashboardSummery = async (req, res, next) =>{
    try{
        const currentYear = new Date().getFullYear()

        const totalEmployees = await EMPLOYEE.find({status:true}).countDocuments()
        const totalCustomers = await CUSTOMER.find({status:true}).countDocuments()
        const totalBranch = await BRANCH.find().countDocuments()
        

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
            totalEmployees
        },message:"Dashboard summery retrived successfully.",success:true})

    }catch(err){
        next(err)
    }
}