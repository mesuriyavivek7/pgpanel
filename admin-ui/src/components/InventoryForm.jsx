import React, {useEffect, useState}  from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { inventorySchema } from '../validations/inventorySchema';
import { useForm } from "react-hook-form";

//Importing icons
import { ChevronLeft, LoaderCircle } from "lucide-react";

import {toast} from 'react-toastify'
import { getAllBranch } from '../services/branchService';
import { createTransactionForInventoryPurchase } from '../services/transactionService';
import { getAllBankAccount } from '../services/bankAccountService';

function InventoryForm({onClose}) {
  const [loading, setLoading] = useState(false)
  const [branches, setBranches] = useState([])
  const [bankAccounts,setBankAccounts] = useState([])

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm({
    mode:'onChange',
    resolver: zodResolver(inventorySchema),
    defaultValues: {
       item_name:'',
       item_type:'',
       amount:0,
       payment_mode:'',
       branch:''
    }
  })

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

  const handleCreateInventoryTransaction = async (transactionData) =>{
     try{
        setLoading(true)
        const data = await createTransactionForInventoryPurchase(transactionData)
        toast.success('New inventory purchase created successfully.')
        onClose(true)
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
           <div className="flex items-center gap-2 mb-2">
            <ChevronLeft size={28} onClick={()=>onClose(false)} className="cursor-pointer"></ChevronLeft>
            <h1 className="text-2xl font-semibold">Inventory Purchase</h1>
           </div>
           <form onSubmit={handleSubmit(handleCreateInventoryTransaction)} className='flex flex-col gap-4'>
               <div className='flex flex-col gap-2'>
                 <label>Item Name <span className='text-sm text-red-500'>*</span></label>
                 <div className='flex flex-col'>
                    <input 
                    type='text'
                    {...register('item_name')}
                    className='p-2 border border-neutral-300 rounded-md  outline-none'
                    placeholder='Enter item name'
                    ></input>
                    {errors.item_name && <span className='text-sm text-red-500'>{errors.item_name.message}</span>}
                 </div>
               </div>
               <div className='flex flex-col gap-2'>
                 <label>Item Type <span className='text-sm text-red-500'>*</span></label>
                 <div className='flex flex-col'>
                     <select
                     className='p-2 border border-neutral-300 rounded-md  outline-none'
                     {...register('item_type')}
                     >
                        <option value={''}>-- Select Type --</option>
                        <option value={'Vegetable'}>Vegetable</option>
                        <option value={'Grocery'}>Grocery</option>
                        <option value={'Other'}>Other</option>
                     </select>
                    {errors.item_name && <span className='text-sm text-red-500'>{errors.item_name.message}</span>}
                 </div>
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
                <label>Branch <span className='text-sm text-red-500'>*</span></label>
                <div className='flex flex-col'>
                  <select 
                  {...register('branch')}
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
                   {errors.bank_account && <span className='text-sm text-red-500'>{errors.bank_account.message}</span>}
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                <label>Select Payment Mode <span className='tex-sm text-red-500'>*</span></label>
                <div className='flex flex-col'>
                    <select
                    {...register('payment_mode')}
                    className='p-2 border border-neutral-300 rounded-md outline-none'
                    >
                      <option value={''}>-- Select Payment Mode --</option>
                      <option value={'cash'}>Cash</option>
                      <option value={'upi'}>UPI</option>
                      <option value={'bank_transfer'}>Bank Transfer</option>
                    </select>
                    {errors.payment_mode && <span className='text-sm text-red-500'>{errors.payment_mode.message}</span>}
                </div>
              </div>
              <div className="flex justify-center items-center">
               <button type="submit" disabled={loading} className="p-2 hover:bg-blue-600 disabled:cursor-not-allowed w-36 transition-all duration-300 cursor-pointer flex justify-center items-center bg-blue-500 rounded-md text-white font-medium">
                {
                  loading ? 
                  <LoaderCircle className="animate-spin"></LoaderCircle> :
                  'Submit'
                }
              </button>
              </div>
           </form>
        </div>
    </div>
  )
}

export default InventoryForm