import api from "../utils/api";


//For create customer
export const createCustomer = async (customerData) =>{
    try{
        const response = await api.post('/customer', customerData)
        return response.data.data
    }catch(err){
        console.log(err)
        const errMessage = err?.response?.data?.message || "Something went wrong."
        throw new Error(errMessage)
    }
}

//For get all customer 
export const getAllCustomer = async (searchQuery="", branch="", room="") =>{
    try{
        const response = await api.get(`/customer?searchQuery=${searchQuery}&branch=${branch}&room=${room}`)
        return response.data.data.map((item)=> ({...item,id:item._id}))
    }catch(err){
        console.log(err)
        const errMessage = err?.response?.data?.message || "Something went wrong."
        throw new Error(errMessage)
    }
}

//For get customer by roomid
export const getCustomerByRoomId = async (roomId, searchQuery) =>{
    try{
        const response = await api.get(`/customer/room/${roomId}?searchQuery=${searchQuery}`)
        return response.data.data
    }catch(err){
        console.log(err)
        const errMessage = err?.response?.data?.message || "Something went wrong."
        throw new Error(errMessage)
    }
}

//For get customer by branch id
export const getCustomerByBranchId = async (branchId, searchQuery) =>{
    try{
        const response = await api.get(`/customer/branch/${branchId}?searchQuery=${searchQuery}`)
        return response.data.data
    }catch(err){
        console.log(err)
        const errMessage = err?.response?.data?.message || "Something went wrong."
        throw new Error(errMessage)
    }
}

//For update customer details
export const updateCustomer = async (customerId, customerData) =>{
    try{
        const response = await api.put(`/customer/${customerId}`, customerData)
        return response.data.data
    }catch(err){
        console.log(err)
        const errMessage = err?.response?.data?.message || "Something went wrong."
        throw new Error(errMessage)
    }
}

//For change customer status
export const changeCustomerStatus = async (customerId, status) =>{
    try{
        const response = await api.put(`/customer/status/${customerId}`,{status})
        return response.data.data
    }catch(err){
        console.log(err)
        const errMessage = err?.response?.data?.message || "Something went wrong."
        throw new Error(errMessage)
    }
}

//For get customer pending rents
export const getCustomerPendingRents = async (searchQuery="", branch="") =>{
    try{
        const response = await api.get(`/customer/pending-rent?searchQuery=${searchQuery}&branch=${branch}`)
        return response.data.data
    } catch(err){
        console.log(err)
        const errMessage = err?.response?.data?.message || "Something went wrong."
        throw new Error(errMessage)
    }
}

//For delete customer 
export const deleteCustomer = async (customerId) =>{
    try{
        const response = await api.delete(`/customer/${customerId}`)
        return response.data.data
    }catch(err){
        console.log(err)
        const errMessage = err?.response?.data?.message || "Something went wrong."
        throw new Error(errMessage)
    }
}

//For export customer data in excel 
export const exportCustomer = async () =>{
    try{
        const response = await api.get("/customer/export/excel",
        {
            responseType:"blob"
        })
        return response.data
    }catch(err){
        console.log(err)
        const errMessage = err?.response?.data?.message || "Something went wrong."
        throw new Error(errMessage)
    }
}
