import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { employeeSchema } from '../validations/employeeSchema';
import { useForm } from "react-hook-form";

//Importing icons
import { ChevronLeft, LoaderCircle } from "lucide-react";
import { toast } from "react-toastify";
import { getAllBranch } from '../services/branchService';
import { createEmployee, updateEmployee } from '../services/employeeService';


function EmployeeForm({selectedEmployee, onClose}) {
  const [loading, setLoading] = useState(false)
  const [branches, setBranches] = useState([])
  const [selectedBranch,setSelectedBranch] = useState('')

  const {
    register,
    handleSubmit,
    formState: {errors},
    reset
  } = useForm({
    mode:'onChange',
    resolver: zodResolver(employeeSchema),
    defaultValues: {
       employee_name:'',
       salary:0,
       mobile_no:'',
       branch:'',
       employee_type:'Cook'
    }
  })

  useEffect(()=>{
    if(selectedEmployee) {
        reset({
            employee_name:selectedEmployee.employee_name,
            salary:selectedEmployee.salary,
            mobile_no:selectedEmployee.mobile_no,
            branch:selectedEmployee.branch._id,
            employee_type:selectedEmployee.employee_type
        })
        setSelectedBranch(selectedEmployee?.branch?._id)
    }
  },[])

  useEffect(()=>{
   const handleGetAllBranch = async ()=>{
     try{
        const data = await getAllBranch()
        setBranches(data)
     }catch(err){
        console.log(err)
        toast.error(err?.message)
     }
   }

   handleGetAllBranch()
  },[])

  const handleAddEmployee = async (employeeData) =>{
    setLoading(true)
     try{
       const data = await createEmployee(employeeData)
       onClose(true)
       toast.success("New Employee created successfully.")
     }catch(err){
       console.log(err)
       toast.error(err?.message)
     }finally{
        setLoading(false)
     }
  } 

  const handleEditEmployee = async (employeeData) =>{
     setLoading(true)
     try{
       const data = await updateEmployee(selectedEmployee?._id, employeeData)
       onClose(true)
       toast.success("Employee details updated successfully.")       
     }catch(err){
        toast.error(err?.message)
     }finally{
        setLoading(false)
     }
  }

    
  return (
    <div className='fixed z-50 backdrop-blur-sm inset-0 bg-black/40 flex justify-center items-center px-4 py-4 sm:px-6 sm:py-6'>
        <div className='flex w-full max-w-xl flex-col gap-3 sm:gap-4 bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 max-h-[90vh] overflow-y-auto'>
            <div className='flex items-center gap-2'>
              <ChevronLeft size={24} className="sm:w-7 sm:h-7 cursor-pointer flex-shrink-0" onClick={()=>onClose(false)}></ChevronLeft>
              <h1 className="text-lg sm:text-xl md:text-2xl font-semibold break-words">{selectedEmployee ? "Edit Employee" : "Add Employee"}</h1>
            </div>
            <form onSubmit={handleSubmit(selectedEmployee ? handleEditEmployee : handleAddEmployee)} className='flex flex-col gap-3 sm:gap-4'>
              <div className='flex flex-col gap-1.5 sm:gap-2'>
                <label className='text-sm sm:text-base'>Employee Name <span className='text-sm text-red-500'>*</span></label>
                <div className='flex flex-col'>
                    <input
                    type='text'
                    {...register("employee_name")}
                    className='p-2 sm:p-2.5 text-sm sm:text-base border border-neutral-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='Enter employee name'
                    ></input>
                    {errors.employee_name && <span className='text-xs sm:text-sm text-red-500 mt-1'>{errors.employee_name.message}</span>}
                </div>
              </div>
              <div className='flex flex-col gap-1.5 sm:gap-2'>
                <label className='text-sm sm:text-base'>Mobile No</label>
                <div className='flex flex-col'>
                    <input
                    type='text'
                    {...register("mobile_no")}
                    className='p-2 sm:p-2.5 text-sm sm:text-base border border-neutral-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='Enter mobile no'
                    ></input>
                    {errors.mobile_no && <span className='text-xs sm:text-sm text-red-500 mt-1'>{errors.mobile_no.message}</span>}
                </div>
              </div>
              <div className='flex flex-col gap-1.5 sm:gap-2'>
                <label className='text-sm sm:text-base'>Salary</label>
                <div className='flex flex-col'>
                    <input
                    type='number'
                    {...register("salary" , {valueAsNumber:true})}
                    className='p-2 sm:p-2.5 text-sm sm:text-base border border-neutral-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='Enter salary'
                    ></input>
                    {errors.salary && <span className='text-xs sm:text-sm text-red-500 mt-1'>{errors.salary.message}</span>}
                </div>
              </div>
              <div className='flex flex-col gap-1.5 sm:gap-2'>
                <label className='text-sm sm:text-base'>Employee Type <span className='text-sm text-red-500'>*</span></label>
                <div className='flex flex-col'>
                    <select
                    {...register('employee_type')}
                     className='p-2 sm:p-2.5 text-sm sm:text-base border border-neutral-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'>
                        <option value={'Cook'}>Cook</option>
                        <option value={'Co-Worker'}>Co-Worker</option>
                    </select>
                    {errors.employee_type && <span className='text-xs sm:text-sm text-red-500 mt-1'>{errors.employee_type.message}</span>}
                </div>
              </div>
              <div className='flex flex-col gap-1.5 sm:gap-2'>
                <label className='text-sm sm:text-base'>Branch <span className='text-sm text-red-500'>*</span></label>
                <div className='flex flex-col'>
                  <select 
                  {...register('branch')}
                  value={selectedBranch}
                  onChange={(e)=>setSelectedBranch(e.target.value)}
                  className='p-2 sm:p-2.5 text-sm sm:text-base border border-neutral-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'>
                     <option value={''}>--- Select Branch ---</option>
                     {
                        branches.map((item,index) => (
                            <option key={index} value={item._id}>{item.branch_name}</option>
                        ))
                     }
                  </select>
                  {errors.branch && <span className='text-xs sm:text-sm text-red-500 mt-1'>{errors.branch.message}</span>}
                </div>
              </div>
              <div className="flex justify-center items-center pt-2">
               <button type="submit" disabled={loading} className="p-2.5 sm:p-3 hover:bg-blue-600 disabled:cursor-not-allowed w-full sm:w-36 transition-all duration-300 cursor-pointer flex justify-center items-center bg-blue-500 rounded-md text-white font-medium text-sm sm:text-base disabled:opacity-50">
                {
                  loading ? 
                  <LoaderCircle className="animate-spin w-5 h-5"></LoaderCircle> :
                  selectedEmployee ? "Save" 
                  : "Submit"
                }
              </button>
              </div>
            </form>
        </div>
    </div>
  )
}


export default EmployeeForm