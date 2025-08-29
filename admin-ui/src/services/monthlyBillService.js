import api from "../utils/api";

//For create monthly bill
export const createMonthlyBill = async (billData) =>{
    try{
        const response = await api.post(`/monthlybill`, billData)
        return response.data.data
    }catch(err){
        console.log(err)
        const errMessage = err?.response?.data?.message || "Something went wrong."
        throw new Error(errMessage)
    }
}

//For get all monthly bill
export const getAllMonthlyBill = async (searchQuery="", branch="") =>{
    try{
        const response = await api.get(`/monthlybill?searchQuery=${searchQuery}&branch=${branch}`)
        return response.data.data
    }catch(err){
        console.log(err)
        const errMessage = err?.response?.data?.message || "Something went wrong."
        throw new Error(errMessage)
    }
}

//For update monthly bill details
export const updateMonthlyBill= async (billData, billId) =>{
    try{
        const response = await api.put(`/monthlybill/${billId}`,billData)
        return response.data.data
    }catch(err){
        console.log(err)
        const errMessage = err?.response?.data?.message || "Something went wrong."
        throw new Error(errMessage)
    }
}

//For delete monthly bill
export const deleteMonthlyBill = async (billId) => {
    try{
        const response = await api.delete(`/monthlybill/${billId}`)
        return response.data.data
    }catch(err){
        console.log(err)
        const errMessage = err?.response?.data?.message || "Something went wrong."
        throw new Error(errMessage)
    }
}