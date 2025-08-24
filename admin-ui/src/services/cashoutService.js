import api from '../utils/api.js'

//For get all cashout transaction
export const getAllCashout = async (searchQuery="") =>{
    try{
        const response = await api.get(`/cashout?searchQuery=${searchQuery}`)
        return response.data.data
    }catch(err){
        console.log(err)
        const errMessage = err?.response?.data?.message || "Something went wrong."
        throw new Error(errMessage)
    }
}