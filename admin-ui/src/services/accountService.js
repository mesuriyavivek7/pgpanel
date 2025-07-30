import api from "../utils/api";


//For create new account manager
export const createAcManager = async (acmanagerData) =>{
    try{
       const response = await api.post(`/acmanager`, acmanagerData)
       return response.data.data
    }catch(err){
       console.log(err)
       const errMessage = err?.response?.data?.message
       throw new Error(errMessage)
    }
}

//For get all acmanager 
export const getAllAcmanager = async (searchQuery="", branch="") =>{
   try{
     const response = await api.get(`/acmanager?searchQuery=${searchQuery}&branch=${branch}`)
     console.log(response.data)
     return response.data.data.map((item)=> ({...item,id:item._id}))
   }catch(err){
     console.log(err)
     const errMessage = err?.response?.data?.message
     throw new Error(errMessage)
   }
}

//For update acmanager
export const updateAcmanager = async (acmanagerData, acmanagerId) => {
    try{
      const response = await api.put(`/acmanager/${acmanagerId}`,acmanagerData)
      return response.data.data
    }catch(err){
      console.log(err)
      const errMessage = err?.response?.data?.message
      throw new Error(errMessage)
    }
}