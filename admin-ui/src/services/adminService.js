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