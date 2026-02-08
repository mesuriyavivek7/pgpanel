import api from '../utils/api'

//For create new room
export const createRoom = async (roomData) =>{
   try{
     const response = await api.post('/room', roomData)
     return response.data.data
   }catch(err){
    console.log(err)
    const errMessage = err?.response?.data?.message || "Something went wrong."
    throw new Error(errMessage)
   }
}

//For get room by branch
export const getRoomByBranchId = async (branchId) =>{
    try{
      const response = await api.get(`/room/branch/${branchId}`)
      return response.data.data
    }catch(err){
      console.log(err)
      const errMessage = err?.response?.data?.message || "Something went wrong."
      throw new Error(errMessage)
    }
}

//For update room
export const updateRoom = async (roomId,roomData) =>{
    try{
      const response = await api.put(`/room/${roomId}`,roomData)
      return response.data.data
    }catch(err){
      console.log(err)
      const errMessage = err?.response?.data?.message || "Something went wrong."
      throw new Error(errMessage)
    }
}


//For get room details by id
export const getRoomById = async (roomId) =>{
   try{
    const response = await api.get(`/room/${roomId}`)
    return response.data.data
   }catch(err){
    console.log(err)
    const errMessage = err?.response?.data?.message || "Something went wrong."
    throw new Error(errMessage)
   }
}

//For delete room 
export const deleteRoomById = async (roomId) =>{
   try{
    const response = await api.delete(`/room/${roomId}`)
    return response.data.data
   }catch(err){
    console.log(err)
    const errMessage = err?.response?.data?.message || "Something went wrong."
    throw new Error(errMessage)
   }
}