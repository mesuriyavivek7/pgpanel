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
  const [isDeposite,setIsDeposite] = useState(false)
  const [isSettled,setIsSettled] = useState(false)

  useEffect(()=>{
    if(!selectedCustomer) navigate('/')
  })

  const handleMarkAsDeposite = () =>{
    if(isDeposite){
      setIsDeposite(false)
    }else{
      setIsDeposite(true)
      setIsSettled(false)
    }
 }

 const handleMarkAsSettled = () =>{
    if(isSettled){
      setIsSettled(false)
    }else{
      setIsSettled(true)
      setIsDeposite(false)
    }
 }

  const {
    register,
    handleSubmit,
    formState: {errors},
    watch
  } = useForm({
    mode:'onChange',
    resolver: zodResolver(customerRentSchema),
    defaultValues: {
        customer: selectedCustomer.customerId,
        amount:0,
        isDeposite:false,
        isSettled: false,
        date:`${selectedCustomer?.pending_rent[0]?.month}-${selectedCustomer?.pending_rent[0]?.year}`,
        payment_mode:'',
        bank_account:''
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

  console.log(errors)


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
    <div className='fixed z-50 backdrop-blur-sm inset-0 bg-black/40 flex justify-center items-center px-4 py-4 sm:px-6 sm:py-6'>
        <div className='flex w-full max-w-2xl flex-col gap-3 sm:gap-4 bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 max-h-[90vh] overflow-y-auto'>
          <div className="flex items-center gap-2">
            <ChevronLeft size={24} className="sm:w-7 sm:h-7 cursor-pointer flex-shrink-0" onClick={()=>onClose(false)}></ChevronLeft>
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold break-words">Collect Rent</h1>
           </div>
           <div className='grid grid-cols-1 sm:grid-cols-2 items-center gap-3 sm:gap-4'>
              <div className='flex items-center gap-2'>
                 <User className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"></User>
                 <span className='text-sm sm:text-base md:text-lg font-medium break-words'>{capitalise(selectedCustomer?.customer_name)}</span>
              </div>
              <div className='flex items-center gap-2'>
                 <Phone className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"></Phone>
                 <span className='text-sm sm:text-base md:text-lg font-medium'>{selectedCustomer?.mobile_no}</span>
              </div>
              <div className='flex items-start gap-2'>
                 <House className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5"></House>
                 <Tooltip title={selectedCustomer?.branch?.branch_name}>
                  <span className='text-sm sm:text-base md:text-lg font-medium break-words'>{sliceString(selectedCustomer?.branch?.branch_name,20)}</span>
                 </Tooltip>
              </div>
              <div className='flex items-center gap-2'>
                 <BedSingle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"></BedSingle>
                 <span className='text-sm sm:text-base md:text-lg font-medium'>{capitalise(selectedCustomer?.room?.room_id)}</span>
              </div>
              <div className='flex items-center gap-2'>
                <Coins className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"></Coins>
                <span className='text-sm sm:text-base md:text-lg font-medium'>₹{selectedCustomer?.rent_amount}</span>
              </div>
              <div className='flex flex-col gap-1'> 
                  <label className='text-sm sm:text-base font-medium'>Pending Amount</label>
                  <span className='text-sm sm:text-base md:text-lg font-medium'>₹{selectedRent?.pending}</span>
              </div>
           </div>
           <form onSubmit={handleSubmit(handlePay)} className='flex flex-col gap-3 sm:gap-4'>
              <div className='grid grid-cols-1 sm:grid-cols-2 items-start gap-3 sm:gap-4'>
                <div className='flex flex-col gap-1.5 sm:gap-2'>
                 <label htmlFor='deposite' className='text-sm sm:text-base'>Is Deposite Month? <span className='text-sm text-red-500'>*</span></label>
                 <div className='flex items-start gap-2'>
                  <input 
                  id='deposite'
                  checked={isDeposite}
                  type='checkbox'
                  {...register("isDeposite")}
                  onChange={handleMarkAsDeposite}
                  className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer mt-0.5 flex-shrink-0"
                  ></input>
                  <span className='text-xs sm:text-sm text-gray-500 leading-relaxed'>(If checked, rent will be adjusted from deposite amount.)</span>
                 </div>
                </div>
                <div className='flex flex-col gap-1.5 sm:gap-2'>
                  <label htmlFor='settled' className='text-sm sm:text-base'>Is Settled Rent? <span className='text-sm text-red-500'>*</span></label>
                  <div className='flex items-start gap-2'>
                    <input 
                    id='settled'
                    checked={isSettled}
                    type='checkbox'
                    {...register("isSettled")}
                    onChange={handleMarkAsSettled} 
                    className='w-4 h-4 sm:w-5 sm:h-5 cursor-pointer mt-0.5 flex-shrink-0'
                    ></input>
                    <span className='text-xs sm:text-sm text-gray-500 leading-relaxed'>(If checked, rent amount will be settled for this month.)</span>
                  </div>
                </div>
               
              </div>
             {
              !isDeposite && 
              <div className='flex flex-col gap-1.5 sm:gap-2'>
               <label className='text-sm sm:text-base'>Amount <span className='text-sm text-red-500'>*</span></label>
               <div className='flex flex-col'>
                 <input 
                 type='number'
                 {...register("amount",{ valueAsNumber: true })}
                 className="p-2 sm:p-2.5 text-sm sm:text-base border border-neutral-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 placeholder="Enter amount"
                 ></input>
                 {errors.amount && <span className='text-xs sm:text-sm text-red-500 mt-1'>{errors.amount.message}</span>}
               </div>
              </div>
             }
              <div className='flex flex-col gap-1.5 sm:gap-2'>
                <label className='text-sm sm:text-base'>Select Month/Year <span className='text-sm text-red-500'>*</span></label>
                <div className='flex flex-col'>
                 <select 
                 {...register("date")}
                 onChange={handleSelectRent}
                 className='p-2 sm:p-2.5 text-sm sm:text-base border border-neutral-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                 >
                   {
                      selectedCustomer?.pending_rent.map((item,index)=>(
                         <option key={index} value={`${item.month}-${item.year}`}>{`${getShortMonthName(item.month)} ${item.year}`}</option>
                      ))
                   }
                 </select>
                 {errors.date && <span className='text-xs sm:text-sm text-red-500 mt-1'>{errors.date.message}</span>}
                </div>
              </div>
              {
                !isDeposite &&
                <div className='flex flex-col gap-1.5 sm:gap-2'>
                 <label className='text-sm sm:text-base'>Select Payment Mode <span className='text-sm text-red-500'>*</span></label>
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
              }
              {
                !isDeposite && 
                <div className='flex flex-col gap-1.5 sm:gap-2'>
                <label className='text-sm sm:text-base'>Select Bank Account <span className='text-red-500 text-sm'>*</span></label>
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
              }
              <div className="flex justify-center items-center pt-2">
              <button type="submit" disabled={loading} className="p-2.5 sm:p-3 hover:bg-blue-600 w-full sm:w-36 transition-all duration-300 cursor-pointer flex justify-center items-center bg-blue-500 rounded-md text-white font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed">
                {
                  loading ? 
                  <LoaderCircle className="animate-spin w-5 h-5"></LoaderCircle> :
                  "Submit"
                }
             </button>
          </div>
           </form>
        </div>
    </div>
  )
}

export default CustomerRentForm