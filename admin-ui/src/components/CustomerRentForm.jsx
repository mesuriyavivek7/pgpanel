import React, {useEffect, useState}  from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { customerRentSchema } from '../validations/customerRentSchema';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';

//Importing icons
import { ChevronLeft, LoaderCircle } from "lucide-react";
import { User } from 'lucide-react';
import { House } from 'lucide-react';
import { Phone } from 'lucide-react';
import { BedSingle, Coins } from 'lucide-react';


import { toast } from "react-toastify";

import { capitalise, getShortMonthName, sliceString } from '../helper';
import Tooltip from '@mui/material/Tooltip';
import { createTransactionForCustomerPay } from '../services/transactionService';
import { getAllBankAccount } from '../services/bankAccountService';

function CustomerRentForm({selectedCustomer, onClose}) {
  const [loading,setLoading] = useState(false)  
  const navigate = useNavigate()
  const [selectedRent,setSelectedRent] = useState(selectedCustomer?.pending_rent[0] || null)
  const [bankAccounts,setBankAccounts] = useState([])

  useEffect(()=>{
    if(!selectedCustomer) navigate('/')
  })

  const {
    register,
    handleSubmit,
    formState: {errors},
    reset
  } = useForm({
    mode:'onChange',
    resolver: zodResolver(customerRentSchema),
    defaultValues: {
        customer: selectedCustomer.customerId,
        amount:0,
        date:`${selectedCustomer?.pending_rent[0]?.month}-${selectedCustomer?.pending_rent[0]?.year}`,
        payment_mode:''
    }
  })

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


  const handlePay = async (formData) =>{
    setLoading(true)
    try{
        const [month, year] = formData?.date.split("-")
        const data = await createTransactionForCustomerPay({...formData,month:Number(month), year:Number(year)})
        onClose(true)
        toast.success("Customer rent paid successfully.")
    }catch(err){
        console.log(err)
        toast.error(err?.message)
    }finally{
        setLoading(false)
    }
  }

  const handleSelectRent = (e) =>{
      let date = e.target.value 
      let [month, year] = date.split('-')

      let rent = selectedCustomer?.pending_rent.find((item) => item.month === Number(month) && item.year === Number(year))
      setSelectedRent(rent)
  }

  return (
    <div className='fixed z-50 backdrop-blur-sm inset-0 bg-black/40 flex justify-center items-center'>
        <div className='flex w-xl flex-col gap-4 bg-white rounded-2xl p-4'>
          <div className="flex items-center gap-2 mb-2">
            <ChevronLeft size={28} onClick={()=>onClose(false)} className="cursor-pointer"></ChevronLeft>
            <h1 className="text-2xl font-semibold">Pay Rent</h1>
           </div>
           <div className='grid mb-2 grid-cols-2 items-center gap-4'>
              <div className='flex items-center gap-2'>
                 <User></User>
                 <span className='text-lg font-medium'>{capitalise(selectedCustomer?.customer_name)}</span>
              </div>
              <div className='flex items-center gap-2'>
                 <Phone></Phone>
                 <span className='text-lg font-medium'>{selectedCustomer?.mobile_no}</span>
              </div>
              <div className='flex items-start gap-2'>
                 <House></House>
                 <Tooltip title={selectedCustomer?.branch?.branch_name}>
                  <span className='text-lg font-medium'>{sliceString(selectedCustomer?.branch?.branch_name,20)}</span>
                 </Tooltip>
              </div>
              <div className='flex items-center gap-2'>
                 <BedSingle></BedSingle>
                 <span className='text-lg font-medium'>{capitalise(selectedCustomer?.room?.room_id)}</span>
              </div>
              <div className='flex items-center gap-2'>
                <Coins></Coins>
                <span className='text-lg font-medium'>₹{selectedCustomer?.rent_amount}</span>
              </div>
           </div>
           <form onSubmit={handleSubmit(handlePay)} className='flex flex-col gap-4'>
              <div className='flex flex-col gap-2'>
                <label>Pending Rent</label>
                <span>₹{selectedRent?.pending}</span>
              </div>
              <div className='flex flex-col gap-2'>
                <label>Amount <span className='text-sm text-red-500'>*</span></label>
                <div className='flex flex-col'>
                  <input 
                  type='number'
                  {...register("amount",{ valueAsNumber: true })}
                  className="p-2 border border-neutral-300 rounded-md outline-none"
                  placeholder="Enter amount"
                  ></input>
                  {errors.amount && <span className='text-sm text-red-500'>{errors.amount.message}</span>}
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                <label>Select Month/Year <span className='text-sm text-red-500'>*</span></label>
                <div className='flex flex-col'>
                 <select 
                 {...register("date")}
                 onChange={handleSelectRent}
                 className='p-2 border border-neutral-300 rounded-md outline-none'
                 >
                   {
                      selectedCustomer?.pending_rent.map((item,index)=>(
                         <option key={index} value={`${item.month}-${item.year}`}>{`${getShortMonthName(item.month)} ${item.year}`}</option>
                      ))
                   }
                 </select>
                 {errors.date && <span className='text-sm text-red-500'>{errors.date.message}</span>}
                </div>
              </div>
              <div className='flex flex-col gap-1'>
                <label>Select Bank Account <span className='text-red-500 text-sm'>*</span></label>
                <div className='flex flex-col'>
                   <select 
                   {...register('bank_account')}
                   className='p-2 border border-neutral-300 rounded-md outline-none'>
                     <option value={''}>-- Select Bank Account --</option>
                     {
                       bankAccounts.map((item, index) => (
                        <option value={item._id} key={index}>{item.account_holdername}</option>
                       ))
                     }
                   </select>
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                <label>Select Payment Mode <span className='text-sm text-red-500'>*</span></label>
                <div className='flex flex-col'>
                    <select
                    {...register('payment_mode')}
                    className='p-2 border border-neutral-300 rounded-md outline-none'
                    >
                      <option value={''}>-- Select Payment Mode --</option>
                      <option value={'cash'}>Cash</option>
                      <option value={'online'}>Online</option>
                      <option value={'cheque'}>Cheque</option>
                      <option value={'upi'}>UPI</option>
                      <option value={'bank_transfer'}>Bank Transfer</option>
                    </select>
                    {errors.payment_mode && <span className='text-sm text-red-500'>{errors.payment_mode.message}</span>}
                </div>
              </div>
              <div className="flex justify-center items-center">
              <button type="submit" disabled={loading} className="p-2 hover:bg-blue-600 w-36 transition-all duration-300 cursor-pointer flex justify-center items-center bg-blue-500 rounded-md text-white font-medium">
                {
                  loading ? 
                  <LoaderCircle className="animate-spin"></LoaderCircle> :
                  "Pay"
                }
             </button>
          </div>
           </form>
        </div>
    </div>
  )
}

export default CustomerRentForm