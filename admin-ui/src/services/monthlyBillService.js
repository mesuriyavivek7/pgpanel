import api from "../utils/api";

//For create monthly bill
export const createMonthlyBill = async (billData) =>{
    try{
        const response = await api.get(`/monthlybill`, billData)
        return response.data.data
    }catch(err){
        console.log(err)
        const errMessage = err?.response?.data?.message || "Something went wrong."
        throw new Error(errMessage)
    }
}

//For get all monthly bill
export const getAllMonthlyBill = async () =>{
    try{
        const response = await api.get('/monthlybill')
        return response.data.data
    }catch(err){
        console.log(err)
        const errMessage = err?.response?.data?.message || "Something went wrong."
        throw new Error(errMessage)
    }
}