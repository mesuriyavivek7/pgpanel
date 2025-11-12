import api from "../utils/api";


//create transaction for pay customer rent 
export const createTransactionForCustomerPay = async (transactionData) =>{
     try{
        const response = await api.post('/transaction/customer-rent', transactionData)
        return response.data.data
     }catch(err){
        console.log(err)
        const errMessage = err?.response?.data?.message || "Something went wrong."
        throw new Error(errMessage)
     }
}

//Create transaction for advance rent pay
export const createTransactionForAdvanceRentPay = async (transactionData) =>{
   try{
      const response = await api.post('/transaction/advance-rent', transactionData)
      return response.data.data
   }catch(err){
      console.log(err)
      const errMessage = err?.response?.data?.message || "Something went wrong."
      throw new Error(errMessage)
   }
}

//Create transaction for deposite collection
export const createTransactionForDepositeCollection = async (transactionData) =>{
   try{
      const response = await api.post('/transaction/deposite', transactionData)
      return response.data.data
   }catch(err){
      console.log(err)
      const errMessage = err?.response?.data?.message || "Something went wrong."
      throw new Error(errMessage)
   }
}

//Create transaction for employee salary 
export const createTransactionForEmployeePay = async (transactionData) =>{
   try{
      const response = await api.post('/transaction/employee-salary', transactionData)
      return response.data.data
   }catch(err){
      console.log(err)
      const errMessage = err?.response?.data?.message || "Something went wrong."
      throw new Error(errMessage)
   }
}

//Create transaction for employee advance salary
export const createTransactionForEmployeeAdvancePay = async (transactionData) =>{
   try{
      const response = await api.post('/transaction/employee-advance-salary', transactionData)
      return response.data.data
   }catch(err){
      console.log(err)
      const errMessage = err?.response?.data?.message || "Something went wrong."
      throw new Error(errMessage)
   }
}

//Create transaction for inventory purchase
export const createTransactionForInventoryPurchase = async (transactionData) =>{
   try{
      const response = await api.post('/transaction/inventory-purchase', transactionData)
      return response.data.data
   }catch(err){
      console.log(err)
      const errMessage = err?.response?.data?.message || "Something went wrong."
      throw new Error(errMessage)
   }
}

//Create transaction for pay monthly bill
export const createTransactionForMonthlyPay = async (transactionData) => {
   try{
      const response = await api.post('/transaction/monthly-payment', transactionData)
      return response.data.data
   }catch(err){
      console.log(err)
      const errMessage = err?.response?.data?.message || "Something went wrong."
      throw new Error(errMessage)
   }
}

//Create transaction for cashout 
export const createTransactionForCashout = async (transactionData) => {
   try{
      const response = await api.post('/transaction/cashout-pay', transactionData)
      return response.data.data
   }catch(err){
      console.log(err)
      const errMessage = err?.response?.data?.message || "Something went wrong."
      throw new Error(errMessage)
   }
}

//For get all transactions
export const getAllTransactions = async (branch="",transactionType="") =>{
   try{
      const response = await api.get(`/transaction?branch=${branch}&transactionType=${transactionType}`)
      return response.data.data
   }catch(err){
      console.log(err)
      const errMessage = err?.response?.data?.message || "Something went wrong."
      throw new Error(errMessage)
   }
}

