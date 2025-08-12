import api from "../utils/api";

//For get all inventory item 
export const getAllInventoryTransaction = async (searchQuery="", branch="") =>{
    try{
      const response = await api.get(`/inventory?searchQuery=${searchQuery}&branch=${branch}`)
      return response.data.data
    }catch(err){
      console.log(err)
      const errMessage = err?.response?.data?.message || "Something went wrong."
      throw new Error(errMessage)
    }
}