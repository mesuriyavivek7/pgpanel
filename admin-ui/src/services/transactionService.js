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

//Create transaction for inventory purchase
export const createTransactionForInventoryPurchase = async (transactionData) =>{
   try{
      const response = await api.post('/transaction/inventory-purchase', transactionData)
      return response.data
   }catch(err){
      console.log(err)
      const errMessage = err?.response?.data?.message || "Something went wrong."
      throw new Error(errMessage)
   }
}

//Create transaction for pay monthly bill
export const createTransactionForMonthlyPay = async (transactionData) => {
   try{
      const response = await api.post('/transaction/inventory-purchase', transactionData)
      return response.data
   }catch(err){
      console.log(err)
      const errMessage = err?.response?.data?.message || "Something went wrong."
      throw new Error(errMessage)
   }
}