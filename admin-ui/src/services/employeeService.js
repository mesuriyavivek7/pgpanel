import api from "../utils/api";

//for create employee
export const createEmployee = async (employeeData) =>{
    try{
        const response = await api.post(`/employee`, employeeData)
    }catch(err){
        console.log(err)
        const errMessage = err?.response?.data?.message || "Something went wrong."
        throw new Error(errMessage)
    }
}

//For get all employee
export const getAllEmployee = async (searchQuery="", branch="") =>{
    try{
        const response = await api.get(`/employee?searchQuery=${searchQuery}&branch=${branch}`)
        return response.data.data.map((item)=> ({...item,id:item._id}))
    }catch(err){
        console.log(err)
        const errMessage = err?.response?.data?.message || "Something went wrong."
        throw new Error(errMessage)
    }
}

//For update employee details
export const updateEmployee = async (employeeId, employeeData) => {
    try{
        const response = await api.put(`/employee/${employeeId}`, employeeData)
        return response.data.data
    }catch(err){
        console.log(err)
        const errMessage = err?.response?.data?.message || "Something went wrong."
        throw new Error(errMessage)
    }
}

//For change status of employee
export const changeEmployeeStatus = async (employeeId, status) =>{
    try{
        const response = await api.put(`/employee/status/${employeeId}`, {status})
        return response.data.data
    }catch(err){
        console.log(err)
        const errMessage = err?.response?.data?.message || "Something went wrong."
        throw new Error(errMessage)
    }
}

//For get all employee salary 
export const getEmployeeSalary = async (searchQuery="", branch="") =>{
    try{
        const response = await api.get(`/employee/salary-details?searchQuery=${searchQuery}&branch=${branch}`)
        return response.data.data
    }catch(err){
        console.log(err)
        const errMessage = err?.response?.data?.message || "Something went wrong."
        throw new Error(errMessage)
    }
}

//For delete employee 
export const deleteEmployee = async (employeeId) => {
    try{
        const response = await api.delete(`/employee/${employeeId}`)
        return response.data.data
    }catch(err){
        console.log(err)
        const errMessage = err?.response?.data?.message || "Something went wrong."
        throw new Error(errMessage)
    }
}

//For export employee data 
export const exportEmployee = async () =>{
    try{
        const response = await api.get('/employee/export/excel', {
            responseType:"blob"
        })
        console.log('Employee--->', response)
        return response.data
    }catch(err){
        console.log(err)
        const errMessage = err?.response?.data?.message || "Something went wrong."
        throw new Error(errMessage)
    }
}