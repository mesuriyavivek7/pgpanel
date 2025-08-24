import api from "../utils/api";


export const createBranch = async (branchData) =>{
    try{
      const response = await api.post('/branch', branchData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
      )
      return response.data.data
    }catch(err){
        console.log(err)
        const errMessage = err?.response?.data?.message || "Something went wrong."
        throw new Error(errMessage)
    }
}

export const getAllBranch = async (searchQuery = "") =>{
   try{
        const response = await api.get(`/branch?searchQuery=${searchQuery}`)
        return response.data.data
   }catch(err){
        console.log(err)
        const errMessage = err?.response?.data?.message || "Something went wrong."
        throw new Error(errMessage)
   }
}


export const updateBranch = async (branchData, branchId) =>{
   try{
       const response = await api.put(`/branch/${branchId}`,branchData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
       })
       return response.data.data
   }catch(err){
       console.log(err)
       const errMessage = err?.response?.data?.message || "Something went wrong."
       throw new Error(errMessage)
   }
}


export const getBranchById = async (branchId) =>{
  try{
       const response = await api.get(`/branch/${branchId}`)
       return response.data.data
  }catch(err){
       console.log(err)
       const errMessage = err?.response?.data?.message || "Something went wrong."
       throw new Error(errMessage)
  }
}

export const getDashboardSummery = async (branchId) =>{
  try{
    const response = await api.get(`/branch/dashboard-summery/${branchId}`)
    return response.data.data
  }catch(err){
    console.log(err)
    const errMessage = err?.response?.data?.message || "Something went wrong."
    throw new Error(errMessage)
  }
}