import api from "../utils/api";

//For create bank account 
export const createBankAccount = async (accountData) =>{
    try{
       const response = await api.post(`/bankaccount`, accountData)
       return response.data.data
    }catch(err){ 
       console.log(err)
       const errMessage = err?.response?.data?.message || "Something went wrong."
       throw new Error(errMessage)
    }
}

//For get all bank account
export const getAllBankAccount = async () =>{
    try{
      const response = await api.get(`/bankaccount`)
      return response.data.data
    }catch(err){
      console.log(err)
      const errMessage = err?.response?.data?.message || "Something went wrong."
      throw new Error(errMessage)
    }
}

//For update bank account 
export const updateBankAccount = async (accountId,data) =>{
  try{
    const response = await api.put(`/bankaccount/${accountId}`, data)
    return response.data.data
  }catch(err){
    console.log(err)
    const errMessage = err?.response?.data?.message || "Something went wrong."
    throw new Error(errMessage)
  }
}