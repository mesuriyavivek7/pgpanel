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
import { getAllBankAccount } from '../services/bankAccountService';


function CustomerForm({selectedCustomer, isAdvance, onClose}) {
  const [loading,setLoading] = useState(false)
  const [branches,setBranches] = useState([])
  const [rooms,setRooms] = useState([])
  const [selectedBranch,setSelectedBranch] = useState('')
  const [selectedRoom,setSelectedRoom] = useState('')
  const [bankAccounts,setBankAccounts] = useState([])

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
       variable_deposite_amount:0,
       rent_amount:0,
       mobile_no:'',
       joining_date:new Date().toISOString().split("T")[0],
       branch:'',
       room:'',
       bank_account:'',
       payment_mode:''
    }
  })

  useEffect(()=>{
    if(selectedCustomer && !isAdvance) {
      reset({
        customer_name:selectedCustomer.customer_name,
        deposite_amount:selectedCustomer.deposite_amount,
        rent_amount:selectedCustomer.rent_amount,
        mobile_no:selectedCustomer.mobile_no,
        joining_date:new Date(selectedCustomer.joining_date).toISOString().split("T")[0],
        branch:selectedCustomer.branch._id,
        room:selectedCustomer.room._id,
        variable_deposite_amount:0,
        payment_mode:'NONE',
        bank_account:'NONE'
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

  useEffect(()=> {
    const handleGetBankAccounts = async () =>{
       try{
        const data = await getAllBankAccount()
        setBankAccounts(data)
       }catch(err){
        console.log(err)
        toast.error(err?.message)
       }
    }

    handleGetBankAccounts()
  },[])


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

  const handleAdvanceBooking = async (customerData) =>{
    setLoading(true)
    console.log(customerData)
     try{
       let formData = {
         ...customerData,
         isAdvance:true,
         replaceCustomer:selectedCustomer._id
       }
       const data = await createCustomer(formData)
       onClose(true)
       toast.success("Advance booking successfully.")
     }catch(err){
        console.log(err)
        toast.error(err?.message)
     }finally{
      setLoading(false)
     }
  } 

  console.log(errors)

  return (
    <div className='fixed z-50 backdrop-blur-sm inset-0 bg-black/40 flex justify-center items-center px-4 py-4 sm:px-6 sm:py-6'>
        <div className='flex w-full max-w-2xl flex-col gap-3 sm:gap-4 bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 max-h-[90vh] overflow-y-auto'>
           <div className="flex items-center gap-2">
            <ChevronLeft size={24} className="sm:w-7 sm:h-7 cursor-pointer flex-shrink-0" onClick={()=>onClose(false)}></ChevronLeft>
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold break-words">{selectedCustomer ? (isAdvance ? "Advance Booking" :"Edit Customer") : "Add Customer"}</h1>
           </div>
           <form onSubmit={handleSubmit(selectedCustomer ? (isAdvance ? handleAdvanceBooking : handleEditCustomer) : handleAddCustomer)} className='flex flex-col gap-3 sm:gap-4'>
             <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
              <div className='flex flex-col gap-1.5 sm:gap-2'>
                <label className='text-sm sm:text-base'>Customer Name <span className='text-sm text-red-500'>*</span></label>
                <div className='flex flex-col'>
                 <input 
                 type='text'
                 {...register("customer_name")}
                 className="p-2 sm:p-2.5 text-sm sm:text-base border border-neutral-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 placeholder="Enter customer name"
                 ></input>
                 {errors.customer_name && <span className='text-xs sm:text-sm text-red-500 mt-1'>{errors.customer_name.message}</span>}
                </div>
              </div>
              <div className='flex flex-col gap-1.5 sm:gap-2'>
                <label className='text-sm sm:text-base'>Mobile No <span className='text-sm text-red-500'>*</span></label>
                <div className='flex flex-col'>
                  <input 
                  type='text'
                  {...register("mobile_no")}
                  className="p-2 sm:p-2.5 text-sm sm:text-base border border-neutral-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter mobile no"
                  ></input>
                  {errors.mobile_no && <span className='text-xs sm:text-sm text-red-500 mt-1'>{errors.mobile_no.message}</span>}
                </div>
              </div>
             </div>
            <div className='flex flex-col gap-1.5 sm:gap-2'>
                <label className='text-sm sm:text-base'>Rent Amount <span className='text-sm text-red-500'>*</span></label>
                <div className='flex flex-col'>
                  <input 
                  type='number'
                  {...register("rent_amount",{ valueAsNumber: true })}
                  className="p-2 sm:p-2.5 text-sm sm:text-base border border-neutral-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter rent amount"
                  ></input>
                  {errors.rent_amount && <span className='text-xs sm:text-sm text-red-500 mt-1'>{errors.rent_amount.message}</span>}
                </div>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
              <div className={`flex flex-col gap-1.5 sm:gap-2 ${(selectedCustomer && !isAdvance) ? "sm:col-span-2" : ""}`}>
                <label className='text-sm sm:text-base'>Fixed Deposite Amount <span className='text-sm text-red-500'>*</span></label>
                <div className='flex flex-col'>
                  <input 
                  type='number'
                  {...register("deposite_amount",{ valueAsNumber: true })}
                  className="p-2 sm:p-2.5 text-sm sm:text-base border border-neutral-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter deposite amount"
                  ></input>
                  {errors.deposite_amount && <span className='text-xs sm:text-sm text-red-500 mt-1'>{errors.deposite_amount.message}</span>}
                </div>
              </div>
              {
                (!selectedCustomer || isAdvance) && 
                <div className='flex flex-col gap-1.5 sm:gap-2'>
                <label className='text-sm sm:text-base'>Pay Deposite Amount <span className='text-sm text-red-500'>*</span></label>
                <div className='flex flex-col'>
                  <input 
                  type='number'
                  {...register("variable_deposite_amount",{ valueAsNumber: true })}
                  className="p-2 sm:p-2.5 text-sm sm:text-base border border-neutral-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter deposite amount"
                  ></input>
                  {errors.variable_deposite_amount && <span className='text-xs sm:text-sm text-red-500 mt-1'>{errors.variable_deposite_amount.message}</span>}
                </div>
                </div>
              }
             
             </div>
            
             <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
              <div className='flex flex-col gap-1.5 sm:gap-2'>
                 <label className='text-sm sm:text-base'>Branch <span className='text-sm text-red-500'>*</span></label>
                 <div className='flex flex-col'>
                 <select 
                  {...register("branch",{onChange: (e) => setSelectedBranch(e.target.value)})}
                  value={selectedBranch}
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
              <div className='flex flex-col gap-1.5 sm:gap-2'>
                 <label className='text-sm sm:text-base'>Room <span className='text-sm text-red-500'>*</span></label>
                 <div className='flex flex-col'>
                 <select 
                  {...register("room", {onChange: (e) => setSelectedRoom(e.target.value)})}
                  value={selectedRoom}
                  className='p-2 sm:p-2.5 text-sm sm:text-base border border-neutral-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'>
                     <option value={''}>--- Select Room ---</option>
                     {
                        rooms.map((item,index) => (
                            <option key={index} value={item._id}>{item.room_id}</option>
                        ))
                     }
                 </select>
                 {errors.room && <span className='text-xs sm:text-sm text-red-500 mt-1'>{errors.room.message}</span>}
                 </div>
              </div>
             </div>

            {
              (!selectedCustomer || isAdvance) &&
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
              <div className='flex flex-col gap-1.5 sm:gap-2'>
                <label className='text-sm sm:text-base'>Select Bank Account (For Dep) <span className='text-red-500 text-sm'>*</span></label>
                <div className='flex flex-col'>
                   <select 
                   {...register('bank_account')}
                   className='p-2 sm:p-2.5 text-sm sm:text-base border border-neutral-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'>
                     <option value={''}>-- Select Bank Account --</option>
                     {
                       bankAccounts.map((item, index) => (
                        <option value={item._id} key={index}>{item.account_holdername}</option>
                       ))
                     }
                   </select>
                   {errors.bank_account && <span className='text-xs sm:text-sm text-red-500 mt-1'>{errors.bank_account.message}</span>}
                </div>
              </div>

              <div className='flex flex-col gap-1.5 sm:gap-2'>
                <label className='text-sm sm:text-base'>Select Payment Mode (For Dep) <span className='text-sm text-red-500'>*</span></label>
                <div className='flex flex-col'>
                    <select
                    {...register('payment_mode')}
                    className='p-2 sm:p-2.5 text-sm sm:text-base border border-neutral-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    >
                      <option value={''}>-- Select Payment Mode --</option>
                      <option value={'cash'}>Cash</option>
                      <option value={'upi'}>UPI</option>
                      <option value={'bank_transfer'}>Bank Transfer</option>
                    </select>
                    {errors.payment_mode && <span className='text-xs sm:text-sm text-red-500 mt-1'>{errors.payment_mode.message}</span>}
                </div>
              </div>

             </div>
            }

             <div className='flex flex-col gap-1.5 sm:gap-2'>
                <label className='text-sm sm:text-base'>Joining Date <span className='text-sm text-red-500'>*</span></label>
                <div className='flex flex-col'>
                <input 
                type='date'
                {...register("joining_date", {valueAsDate: true})}
                className="p-2 sm:p-2.5 text-sm sm:text-base border border-neutral-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></input>
                {errors.joining_date && <span className='text-xs sm:text-sm text-red-500 mt-1'>{errors.joining_date.message}</span>}
                </div>
             </div>
             <div className="flex justify-center items-center pt-2">
             <button type="submit" disabled={loading} className="p-2.5 sm:p-3 hover:bg-blue-600 w-full sm:w-36 transition-all duration-300 cursor-pointer flex justify-center items-center bg-blue-500 rounded-md text-white font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed">
                {
                  loading ? 
                  <LoaderCircle className="animate-spin w-5 h-5"></LoaderCircle> :
                  (selectedCustomer && !isAdvance) ? "Save"
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