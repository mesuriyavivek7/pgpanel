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
    <div className='fixed z-50 backdrop-blur-sm inset-0 bg-black/40 flex justify-center items-center'>
        <div className='flex w-xl flex-col gap-4 bg-white rounded-2xl p-4'>
           <div className="flex items-center gap-2">
             <ChevronLeft size={28} onClick={()=>onClose(false)} className="cursor-pointer"></ChevronLeft>
             <h1 className="text-2xl font-semibold">{monthlyBill ? "Edit Monthly Bill" : "Add Monthly Bill"}</h1>
           </div>
           <form onSubmit={handleSubmit(monthlyBill ? handleEditMonthlyBill : handleAddMonthlyBill)} className='flex flex-col gap-4'>
             <div className='flex flex-col gap-2'>
                <label>Bill Name <span className='text-red-500'>*</span></label>
                <div className='flex flex-col'>
                    <input 
                    {...register('payment_name')}
                    className='p-2 border border-neutral-300 rounded-md outline-none'
                    placeholder='Enter bill name'
                    type='text'>
                    </input>
                    {errors.payment_name && <span className='text-sm text-red-500'>{errors.payment_name.message}</span>}
                </div>
             </div>
             <div className='flex flex-col gap-2'>
                <label>Amount <span className='text-red-500'>*</span></label>
                <div className='flex flex-col'>
                    <input 
                    disabled={monthlyBill}
                    {...register('amount', {valueAsNumber: true})}
                    className='p-2 border disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 border-neutral-300 rounded-md outline-none'
                    placeholder='Enter bill amount'
                    type='number'>
                    </input>
                    {errors.amount && <span className='text-sm text-red-500'>{errors.amount.message}</span>}
                </div>
             </div>
             <div className='flex flex-col gap-2'>
                <label>Branch <span className='text-red-500'>*</span></label>
                <div className='flex flex-col'>
                    <select 
                    {...register("branch")}
                    onChange={(e)=>setSelectedBranch(e.target.value)}
                    value={selectedBranch}
                    className='p-2 border border-neutral-300 rounded-md outline-none'
                    >
                        <option value={''}>-- Select Branch --</option>
                        {
                          branches.map((item,index) => (
                            <option key={index} value={item._id}>{item.branch_name}</option>
                          ))
                        }
                    </select>
                    {errors.branch && <span className='text-sm text-red-500'>{errors.branch.message}</span>}
                </div>
             </div>
             <div className='flex flex-col gap-2'>
                <label>Starting Date <span className='text-red-500'>*</span></label>
                <div className='flex flex-col'>
                    <input 
                    disabled={monthlyBill}
                    {...register('starting_date', {valueAsDate: true})}
                    className='p-2 border disabled:cursor-no-drop disabled:bg-gray-100 disabled:text-gray-400 border-neutral-300 rounded-md outline-none'
                    type='date'>
                    </input>
                    {errors.starting_date && <span className='text-sm text-red-500'>{errors.starting_date.message}</span>}
                </div>
             </div>
             <div className='flex flex-col gap-2'>
                <label>Notes </label>
                <div className='flex flex-col'>
                    <textarea 
                    {...register('notes')}
                    className='p-2 border border-neutral-300 rounded-md outline-none'
                    placeholder='Enter bill amount'
                    type='number'>
                    </textarea>
                </div>
             </div>
             <div className='flex justify-center items-center'>
             <button type="submit" disabled={loading} className="p-2 hover:bg-blue-600 w-36 transition-all duration-300 cursor-pointer flex justify-center items-center bg-blue-500 rounded-md text-white font-medium">
                {
                  loading ? 
                  <LoaderCircle className="animate-spin"></LoaderCircle> :
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