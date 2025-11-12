import React, { useState, useEffect } from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { billSchema } from '../validations/billSchema';

//Importing icons
import { ChevronLeft, LoaderCircle } from "lucide-react";
import { toast } from "react-toastify";

import { getAllBranch } from '../services/branchService';
import { createMonthlyBill, updateMonthlyBill } from '../services/monthlyBillService';

function MonthlyBillForm({monthlyBill,onClose}) {
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
    resolver: zodResolver(billSchema),
    defaultValues: {
        payment_name:'',
        notes:"",
        amount:0,
        branch:'',
        starting_date:new Date().toISOString().split("T")[0]
    }
  })

  useEffect(()=>{
    if(monthlyBill){
        reset({
            payment_name:monthlyBill.billName,
            notes:monthlyBill.notes,
            amount:monthlyBill.amount,
            branch:monthlyBill.branch._id,
            starting_date:monthlyBill.starting_date
        })
        setSelectedBranch(monthlyBill.branch._id)
    }
  },[])

  const handleGetAllBranch = async ()=>{
    try{
      const data = await getAllBranch()
      setBranches(data)
    }catch(err){
      console.log(err)
      toast.error(err?.message)
    }
  }

   useEffect(()=>{
     handleGetAllBranch()
   },[])

   const handleAddMonthlyBill = async (billData) =>{
    setLoading(true)
    try{
        const response = await createMonthlyBill(billData)
        onClose(true)
        toast.success("New monthly bill added successfully.")
    }catch(err){
        console.log(err)
        toast.error(err?.message)
    }finally{
        setLoading(false)
    }
   }

   const handleEditMonthlyBill = async (billData) =>{
    setLoading(true)
    try{
        const response = await updateMonthlyBill(billData, monthlyBill?.billId)
        onClose(true)
        toast.success("Monthly bill details updated successfully.")
    }catch(err){
        console.log(err)
        toast.error(err?.message)
    }finally{
        setLoading(false)
    }
   }

  
  return (
    <div className='fixed z-50 backdrop-blur-sm inset-0 bg-black/40 flex justify-center items-center px-4 py-4 sm:px-6 sm:py-6'>
        <div className='flex w-full max-w-xl flex-col gap-3 sm:gap-4 bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 max-h-[90vh] overflow-y-auto'>
           <div className="flex items-center gap-2">
             <ChevronLeft size={24} className="sm:w-7 sm:h-7 cursor-pointer flex-shrink-0" onClick={()=>onClose(false)}></ChevronLeft>
             <h1 className="text-lg sm:text-xl md:text-2xl font-semibold break-words">{monthlyBill ? "Edit Monthly Bill" : "Add Monthly Bill"}</h1>
           </div>
           <form onSubmit={handleSubmit(monthlyBill ? handleEditMonthlyBill : handleAddMonthlyBill)} className='flex flex-col gap-3 sm:gap-4'>
             <div className='flex flex-col gap-1.5 sm:gap-2'>
                <label className='text-sm sm:text-base'>Bill Name <span className='text-sm text-red-500'>*</span></label>
                <div className='flex flex-col'>
                    <input 
                    {...register('payment_name')}
                    className='p-2 sm:p-2.5 text-sm sm:text-base border border-neutral-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='Enter bill name'
                    type='text'>
                    </input>
                    {errors.payment_name && <span className='text-xs sm:text-sm text-red-500 mt-1'>{errors.payment_name.message}</span>}
                </div>
             </div>
             <div className='flex flex-col gap-1.5 sm:gap-2'>
                <label className='text-sm sm:text-base'>Amount <span className='text-sm text-red-500'>*</span></label>
                <div className='flex flex-col'>
                    <input 
                    disabled={monthlyBill}
                    {...register('amount', {valueAsNumber: true})}
                    className='p-2 sm:p-2.5 text-sm sm:text-base border disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 border-neutral-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='Enter bill amount'
                    type='number'>
                    </input>
                    {errors.amount && <span className='text-xs sm:text-sm text-red-500 mt-1'>{errors.amount.message}</span>}
                </div>
             </div>
             <div className='flex flex-col gap-1.5 sm:gap-2'>
                <label className='text-sm sm:text-base'>Branch <span className='text-sm text-red-500'>*</span></label>
                <div className='flex flex-col'>
                    <select 
                    {...register("branch")}
                    onChange={(e)=>setSelectedBranch(e.target.value)}
                    value={selectedBranch}
                    className='p-2 sm:p-2.5 text-sm sm:text-base border border-neutral-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    >
                        <option value={''}>-- Select Branch --</option>
                        {
                          branches.map((item,index) => (
                            <option key={index} value={item._id}>{item.branch_name}</option>
                          ))
                        }
                    </select>
                    {errors.branch && <span className='text-xs sm:text-sm text-red-500 mt-1'>{errors.branch.message}</span>}
                </div>
             </div>
             <div className='flex flex-col gap-1.5 sm:gap-2'>
                <label className='text-sm sm:text-base'>Starting Date <span className='text-sm text-red-500'>*</span></label>
                <div className='flex flex-col'>
                    <input 
                    disabled={monthlyBill}
                    {...register('starting_date', {valueAsDate: true})}
                    className='p-2 sm:p-2.5 text-sm sm:text-base border disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 border-neutral-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    type='date'>
                    </input>
                    {errors.starting_date && <span className='text-xs sm:text-sm text-red-500 mt-1'>{errors.starting_date.message}</span>}
                </div>
             </div>
             <div className='flex flex-col gap-1.5 sm:gap-2'>
                <label className='text-sm sm:text-base'>Notes</label>
                <div className='flex flex-col'>
                    <textarea 
                    {...register('notes')}
                    rows={3}
                    className='p-2 sm:p-2.5 text-sm sm:text-base resize-none border border-neutral-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='Enter notes'>
                    </textarea>
                </div>
             </div>
             <div className='flex justify-center items-center pt-2'>
             <button type="submit" disabled={loading} className="p-2.5 sm:p-3 hover:bg-blue-600 w-full sm:w-36 transition-all duration-300 cursor-pointer flex justify-center items-center bg-blue-500 rounded-md text-white font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed">
                {
                  loading ? 
                  <LoaderCircle className="animate-spin w-5 h-5"></LoaderCircle> :
                  monthlyBill ? "Save" 
                  : "Submit"
                }
             </button>
             </div>
           </form>
        </div>
    </div>
  )
}

export default MonthlyBillForm