import api from '../utils/api'

export const getDashboardSummery = async () =>{
    try{
       const response = await api.get('/admin/dashboard-summery')
       return response.data.data
    }catch(err){
       console.log(err)
       const errMessage = err?.response?.data?.message
       throw new Error(errMessage)
    }
}

export const getDashboardSearch = async (role, searchQuery) =>{  
   try{
      const response = await api.get(`/admin/dashboard-search/${role}?searchQuery=${searchQuery}`)
      return response.data.data
   } catch(err){
      console.log(err)
      const errMessage = err?.response?.data?.message
      throw new Error(errMessage)
   }
}

//For get admin details 
export const getAdminDetails = async () =>{
   try{
      const response = await api.get(`/admin/me`)
      return response.data.data 
   }catch(err){
      console.log(err)
      const errMessage = err?.response?.data?.message
      throw new Error(errMessage)
   }
}

//For upload admin logo
export const uploadAdminLogo = async (file) =>{
   try{
      const response = await api.post('/admin/upload-logo', file,  {
         headers: {
           'Content-Type': 'multipart/form-data',
         },
       })
      return response.data.data
   }catch(err){
      console.log(err)
      const errMessage = err?.response?.data?.message
      throw new Error(errMessage)
   }
}