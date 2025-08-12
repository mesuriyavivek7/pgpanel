import React, {useEffect, useState}  from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { customerSchema } from '../validations/customerSchema';
import { useForm } from "react-hook-form";

//Importing icons
import { ChevronLeft, LoaderCircle } from "lucide-react";
import { toast } from "react-toastify";
import { getAllBranch } from '../services/branchService';
import { getRoomByBranchId } from '../services/roomService';
import { createCustomer, updateCustomer } from '../services/customerService';


function CustomerForm({selectedCustomer, onClose}) {
  const [loading,setLoading] = useState(false)
  const [branches,setBranches] = useState([])
  const [rooms,setRooms] = useState([])
  const [selectedBranch,setSelectedBranch] = useState('')
  const [selectedRoom,setSelectedRoom] = useState('')
  
  const {
    register,
    handleSubmit,
    formState: {errors},
    reset
  } = useForm({
    mode:'onChange',
    resolver: zodResolver(customerSchema),
    defaultValues: {
       customer_name:'',
       deposite_amount:0,
       rent_amount:0,
       mobile_no:'',
       joining_date:new Date().toISOString().split("T")[0],
       branch:'',
       room:''
    }
  })

  useEffect(()=>{
    if(selectedCustomer) {
      reset({
        customer_name:selectedCustomer.customer_name,
        deposite_amount:selectedCustomer.deposite_amount,
        rent_amount:selectedCustomer.rent_amount,
        mobile_no:selectedCustomer.mobile_no,
        joining_date:new Date(selectedCustomer.joining_date).toISOString().split("T")[0],
        branch:selectedCustomer.branch._id,
        room:selectedCustomer.room._id
      })
      setSelectedBranch(selectedCustomer.branch._id)
      setSelectedRoom(selectedCustomer.room._id)
    }
  },[selectedCustomer])

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

  const handleGetRoomsByBranchId = async () =>{
    try{
        const data = await getRoomByBranchId(selectedBranch)
        setRooms(data)
    }catch(err){
        console.log(err)
        toast.error(err?.message)
    }
  }
  
  useEffect(()=>{
    if(selectedBranch) handleGetRoomsByBranchId(selectedBranch)
  },[selectedBranch])


  const handleAddCustomer = async (customerData)=>{
    setLoading(true)
    try{
       const response = await createCustomer(customerData)
       onClose(true)
       toast.success('New customer added successfully.')
    }catch(err){
        console.log(err)
        toast.error(err?.message)
    }finally{
      setLoading(false)
    }
  }

  const handleEditCustomer = async (customerData) => {
     setLoading(true)
     try{
       const response = await updateCustomer(selectedCustomer._id,customerData)
       onClose(true)
       toast.success("Customer details updated successfully.")
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
            <h1 className="text-2xl font-semibold">{selectedCustomer ? "Edit Customer" : "Add Customer"}</h1>
           </div>
           <form onSubmit={handleSubmit(selectedCustomer ? handleEditCustomer : handleAddCustomer)} className='flex flex-col gap-4'>
             <div className='flex flex-col gap-2'>
                <label>Customer Name <span className='text-sm text-red-500'>*</span></label>
                <div className='flex flex-col'>
                 <input 
                 type='text'
                 {...register("customer_name")}
                 className="p-2 border border-neutral-300 rounded-md outline-none"
                 placeholder="Enter customer name"
                 ></input>
                 {errors.customer_name && <span className='text-sm text-red-500'>{errors.customer_name.message}</span>}
                </div>
             </div>
             <div className='flex flex-col gap-2'>
                <label>Mobile No <span className='text-sm text-red-500'>*</span></label>
                <div className='flex flex-col'>
                  <input 
                  type='text'
                  {...register("mobile_no")}
                  className="p-2 border border-neutral-300 rounded-md outline-none"
                  placeholder="Enter mobile no"
                  ></input>
                  {errors.mobile_no && <span className='text-sm text-red-500'>{errors.mobile_no.message}</span>}
                </div>
             </div>
             <div className='flex flex-col gap-2'>
                <label>Deposite Amount <span className='text-sm text-red-500'>*</span></label>
                <div className='flex flex-col'>
                  <input 
                  type='number'
                  {...register("deposite_amount",{ valueAsNumber: true })}
                  className="p-2 border border-neutral-300 rounded-md outline-none"
                  placeholder="Enter deposite amount"
                  ></input>
                  {errors.deposite_amount && <span className='text-sm text-red-500'>{errors.deposite_amount.message}</span>}
                </div>
             </div>
             <div className='flex flex-col gap-2'>
                <label>Rent Amount <span className='text-sm text-red-500'>*</span></label>
                <div className='flex flex-col'>
                  <input 
                  type='number'
                  {...register("rent_amount",{ valueAsNumber: true })}
                  className="p-2 border border-neutral-300 rounded-md outline-none"
                  placeholder="Enter deposite amount"
                  ></input>
                  {errors.rent_amount && <span className='text-sm text-red-500'>{errors.rent_amount.message}</span>}
                </div>
             </div>
             <div className='flex flex-col gap-2'>
                 <label>Branch <span className='text-sm text-red-500'>*</span></label>
                 <div className='flex flex-col'>
                 <select 
                  {...register("branch",{onChange: (e) => setSelectedBranch(e.target.value)})}
                  value={selectedBranch}
                  className='p-2 border border-neutral-300 rounded-md outline-none'>
                     <option value={''}>--- Select Branch ---</option>
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
                 <label>Room <span className='text-sm text-red-500'>*</span></label>
                 <div className='flex flex-col'>
                 <select 
                  {...register("room", {onChange: (e) => setSelectedRoom(e.target.value)})}
                  value={selectedRoom}
                  className='p-2 border border-neutral-300 rounded-md outline-none'>
                     <option value={''}>--- Select Room ---</option>
                     {
                        rooms.map((item,index) => (
                            <option key={index} value={item._id}>{item.room_id}</option>
                        ))
                     }
                 </select>
                 {errors.room && <span className='text-sm text-red-500'>{errors.room.message}</span>}
                 </div>
             </div>
             <div className='flex flex-col gap-2'>
                <label>Joining Date <span className='text-sm text-red-500'>*</span></label>
                <div className='flex flex-col'>
                <input 
                type='date'
                {...register("joining_date", {valueAsDate: true})}
                className="p-2 border border-neutral-300 rounded-md outline-none"
                placeholder="Enter deposite amount"
                ></input>
                {errors.joining_date && <span className='text-sm text-red-500'>{errors.joining_date.message}</span>}
                </div>
             </div>
             <div className="flex justify-center items-center">
             <button type="submit" disabled={loading} className="p-2 hover:bg-blue-600 w-36 transition-all duration-300 cursor-pointer flex justify-center items-center bg-blue-500 rounded-md text-white font-medium">
                {
                  loading ? 
                  <LoaderCircle className="animate-spin"></LoaderCircle> :
                  selectedCustomer ? "Save" 
                  : "Submit"
                }
             </button>
          </div>
           </form>
        </div>
    </div>
  )
}

export default CustomerForm