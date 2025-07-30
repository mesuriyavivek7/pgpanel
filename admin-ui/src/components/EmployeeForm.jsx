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
    <div className='fixed z-50 backdrop-blur-sm inset-0 bg-black/40 flex justify-center items-center'>
        <div className='flex w-xl flex-col gap-4 bg-white rounded-2xl p-4'>
            <div className='flex items-center gap-2'>
              <ChevronLeft size={28} onClick={()=>onClose(false)} className="cursor-pointer"></ChevronLeft>
              <h1 className="text-2xl font-semibold">{selectedEmployee ? "Edit Employee" : "Add Employee"}</h1>
            </div>
            <form onSubmit={handleSubmit(selectedEmployee ? handleEditEmployee : handleAddEmployee)} className='flex flex-col gap-4'>
              <div className='flex flex-col gap-2'>
                <label>Employee Name <span className='text-sm text-red-500'>*</span></label>
                <div className='flex flex-col'>
                    <input
                    type='text'
                    {...register("employee_name")}
                    className='p-2 border border-neutral-300 rounded-md outline-none'
                    placeholder='Enter employee name'
                    ></input>
                    {errors.employee_name && <span className='text-sm text-red-500'>{errors.employee_name.message}</span>}
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                <label>Mobile No</label>
                <div className='flex flex-col'>
                    <input
                    type='text'
                    {...register("mobile_no")}
                    className='p-2 border border-neutral-300 rounded-md outline-none'
                    placeholder='Enter mobile no'
                    ></input>
                    {errors.mobile_no && <span className='text-sm text-red-500'>{errors.mobile_no.message}</span>}
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                <label>Salary</label>
                <div className='flex flex-col'>
                    <input
                    type='text'
                    {...register("salary" , {valueAsNumber:true})}
                    className='p-2 border border-neutral-300 rounded-md outline-none'
                    placeholder='Enter salary'
                    ></input>
                    {errors.salary && <span className='text-sm text-red-500'>{errors.salary.message}</span>}
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                <label>Employee Type <span className='text-sm text-red-500'>*</span></label>
                <div className='flex flex-col'>
                    <select
                    {...register('employee_type')}
                     className='p-2 border border-neutral-300 rounded-md outline-none'>
                        <option value={'Cook'}>Cook</option>
                        <option value={'Co-Worker'}>Co-Worker</option>
                    </select>
                    {errors.employee_type && <span className='text-sm text-red-500'>{errors.employee_type.message}</span>}
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                <label>Branch <span className='text-sm text-red-500'>*</span></label>
                <div className='flex flex-col'>
                  <select 
                  {...register('branch')}
                  value={selectedBranch}
                  className='p-2 border border-neutral-300 rounded-md outline-none'>
                     <option value={''}>--- Select Branch ---</option>
                     {
                        branches.map((item,index) => (
                            <option key={index} value={item._id}>{item.branch_name}</option>
                        ))
                     }
                  </select>
                </div>
              </div>
              <div className="flex justify-center items-center">
               <button type="submit" disabled={loading} className="p-2 hover:bg-blue-600 disabled:cursor-not-allowed w-36 transition-all duration-300 cursor-pointer flex justify-center items-center bg-blue-500 rounded-md text-white font-medium">
                {
                  loading ? 
                  <LoaderCircle className="animate-spin"></LoaderCircle> :
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