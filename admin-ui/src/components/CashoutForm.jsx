import React, {useEffect, useState}  from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { cashoutSchema } from '../validations/cashoutSchema';
import { useForm } from "react-hook-form";

//Importing icons
import { ChevronLeft, LoaderCircle } from "lucide-react";

import {toast} from 'react-toastify'
import { getAllBankAccount } from '../services/bankAccountService';
import { createTransactionForCashout } from '../services/transactionService';


function CashoutForm({onClose}) {
  const [loading, setLoading] = useState(false)
  const [bankAccounts,setBankAccounts] = useState([])

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm({
    mode:'onChange',
    resolver: zodResolver(cashoutSchema),
    defaultValues: {
       person_name:'',
       amount:0,
       mobile_no:'',
       notes:'',
       transactionType:'',
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

  const hanldeCreateCashoutTransaction = async (transactionData) =>{
    console.log(transactionData)
    try{
        setLoading(true)
        const data = await createTransactionForCashout(transactionData)
        toast.success("New cashout transaction created sucessfully.")
        onClose(true)
    }catch(err){
        console.log(err)
        toast.error(err?.message)
    }finally{
        setLoading(false)
    }
  }
  

  return (
    <div className='fixed z-50 backdrop-blur-sm inset-0 bg-black/40 flex justify-center items-center px-4 py-4 sm:px-6 sm:py-6'>
        <div className='flex w-full max-w-2xl flex-col gap-3 sm:gap-4 bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 max-h-[90vh] overflow-y-auto'>
           <div className="flex items-center gap-2">
            <ChevronLeft size={24} className="sm:w-7 sm:h-7 cursor-pointer flex-shrink-0" onClick={()=>onClose(false)}></ChevronLeft>
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold break-words">Cashout</h1>
           </div>
           <form onSubmit={handleSubmit(hanldeCreateCashoutTransaction)} className='flex flex-col gap-3 sm:gap-4'>
              <div className='flex flex-col gap-1.5 sm:gap-2'>
                <label className='text-sm sm:text-base'>Person Name <span className='text-sm text-red-500'>*</span></label>
                <div className='flex flex-col'>
                    <input 
                    type='text'
                    {...register('person_name')}
                    className='p-2 sm:p-2.5 text-sm sm:text-base border border-neutral-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='Enter person name'
                    ></input>
                    {errors.person_name && <span className='text-xs sm:text-sm text-red-500 mt-1'>{errors.person_name.message}</span>}
                </div>
              </div>
              <div className='flex flex-col gap-1.5 sm:gap-2'>
                <label className='text-sm sm:text-base'>Mobile No</label>
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
              <div className='flex flex-col gap-1.5 sm:gap-2'>
                <label className='text-sm sm:text-base'>Transaction Type <span className='text-sm text-red-500'>*</span></label>
                <div className='flex flex-col'>
                    <select
                    className='p-2 sm:p-2.5 text-sm sm:text-base border border-neutral-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    {...register('transactionType')}
                    >
                        <option value={''}>-- Select Transaction Type --</option>
                        <option value={'expense'}>Given</option>
                        <option value={'income'}>Taken</option>
                    </select>
                    {errors.transactionType && <span className='text-xs sm:text-sm text-red-500 mt-1'>{errors.transactionType.message}</span>}
                </div>
              </div>
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
             
              <div className='flex flex-col gap-1.5 sm:gap-2'>
                <label className='text-sm sm:text-base'>Notes</label>
                <textarea 
                {...register('notes')}
                rows={3}
                className='p-2 sm:p-2.5 text-sm sm:text-base border border-neutral-300 rounded-md outline-none resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='Enter notes'></textarea>
                {errors.notes && <span className='text-xs sm:text-sm text-red-500 mt-1'>{errors.notes.message}</span>}
              </div>
              <div className="flex justify-center items-center pt-2">
               <button type="submit" disabled={loading} className="p-2.5 sm:p-3 hover:bg-blue-600 disabled:cursor-not-allowed w-full sm:w-36 transition-all duration-300 cursor-pointer flex justify-center items-center bg-blue-500 rounded-md text-white font-medium text-sm sm:text-base disabled:opacity-50">
                {
                  loading ? 
                  <LoaderCircle className="animate-spin w-5 h-5"></LoaderCircle> :
                  'Submit'
                }
              </button>
              </div>
           </form>
        </div>
    </div>
  )
}

export default CashoutForm