import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";


//Import icons
import { ReceiptText } from 'lucide-react';
import { Wallet } from 'lucide-react';
import { NotebookPen } from 'lucide-react';
import { House } from 'lucide-react';
import { ChevronLeft } from 'lucide-react';
import { LoaderCircle } from 'lucide-react';

import { sliceString, getShortMonthName } from '../helper';
import { billPaySchema } from '../validations/billPaySchema';

import { getAllBankAccount } from '../services/bankAccountService';
import { toast } from 'react-toastify';
import { createTransactionForMonthlyPay } from '../services/transactionService';

function MonthlyBillPay({monthlyBill, onClose}) {
  const [selectedAmount,setSelectedAmount] = useState(null)
  const [bankAccounts,setBankAccounts] = useState([])
  const [loading,setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(billPaySchema(selectedAmount?.pending)),
    defaultValues: {
        amount:0,
        payment_mode:'',
        date:'',
        bank_account:''
    },
  });

  useEffect(()=>{
    if(monthlyBill){
        setSelectedAmount(monthlyBill.pendingMonths[0])
        reset({
            amount:0,
            date:`${monthlyBill.pendingMonths[0].month}-${monthlyBill.pendingMonths[0].year}`,
            payment_mode:'',
            bank_account:''
        })
    }
  },[])

  const handleSelectAmount = (e) =>{
        let date = e.target.value 
        let [month, year] = date.split('-')

        let amount = monthlyBill.pendingMonths.find((item)=> item.month === Number(month) && item.year === Number(year))
        setSelectedAmount(amount)
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

  const handlePayMonthlyBill = async (payData) =>{
    let [month,year] = payData.date.split('-')
    let obj = {
        ...payData,
        month:Number(month),
        year:Number(year),
        monthlypayment:monthlyBill.billId
    }
    try{
      setLoading(true)
      const response = await createTransactionForMonthlyPay(obj)
      toast.success('Monthly bill paid successfully.')
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
           <div className='flex items-center gap-2'>
              <ChevronLeft size={28} onClick={()=>onClose(false)} className="cursor-pointer"></ChevronLeft>
              <h1 className="text-2xl font-semibold">Pay Monthly Bill</h1>
            </div>
            <div className='grid grid-cols-2 items-center gap-4'>
                <div className='flex items-center gap-2'>
                    <ReceiptText></ReceiptText>
                    <span className='text-lg font-medium'>{monthlyBill.billName}</span>
                </div>
                <div className='flex items-center gap-2'>
                    <Wallet></Wallet>
                    <span className='text-lg font-medium'>₹{monthlyBill.amount}</span>
                </div>
                <div className='flex items-center gap-2'>
                    <House></House>
                    <span className='text-lg font-medium'>{sliceString(monthlyBill.branch.branch_name,20)}</span>
                </div>
                <div className='flex items-center gap-2'>
                    <NotebookPen></NotebookPen>
                    <span className='text-lg font-medium'>{sliceString(monthlyBill.notes,20)}</span>
                </div>
            </div>
            <form onSubmit={handleSubmit(handlePayMonthlyBill)} className='flex flex-col gap-4'>
               <div className='flex flex-col gap-1'>
                 <label>Pending Amount</label>
                 <span>₹{selectedAmount?.pending || 0}</span>
               </div>
               <div className='flex flex-col gap-2'>
                 <label>Amount <span className='text-sm text-red-500'>*</span></label>
                  <div className='flex flex-col'>
                  <input 
                   {...register('amount',{valueAsNumber:true})}
                   type='number'
                   className='p-2 border border-neutral-300 rounded-md outline-none'
                   ></input>
                   {errors.amount && <span className='text-sm text-red-500'>{errors.amount.message}</span>}
                  </div>
               </div>
               <div className="flex flex-col gap-2">
                <label>
                  Select Month/Year{" "}
                  <span className="text-sm text-red-500">*</span>
                </label>
                <div className="flex flex-col">
                  <select
                    {...register("date")}
                    onChange={handleSelectAmount}
                    className="p-2 border border-neutral-300 rounded-md outline-none"
                  >
                    {
                      monthlyBill?.pendingMonths.map((item,index)=>(
                         <option key={index} value={`${item.month}-${item.year}`}>{`${getShortMonthName(item.month)} ${item.year}`}</option>
                      ))
                   }
                  </select>
                  {errors.date && (
                    <span className="text-sm text-red-500">
                      {errors.date.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label>Select Payment Mode</label>
                <div className="flex flex-col">
                  <select
                    {...register("payment_mode")}
                    className="p-2 border border-neutral-300 rounded-md outline-none"
                  >
                    <option value={""}>-- Select Payment Mode --</option>
                    <option value={"cash"}>Cash</option>
                    <option value={"upi"}>UPI</option>
                    <option value={"bank_transfer"}>Bank Transfer</option>
                  </select>
                  {errors.payment_mode && (
                    <span className="text-sm text-red-500">
                      {errors.payment_mode.message}
                    </span>
                  )}
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
              <div className='flex justify-center items-center'>
                <button
                  type="submit"
                  disabled={loading}
                  className="p-2 hover:bg-blue-600 w-36 transition-all duration-300 cursor-pointer flex justify-center items-center bg-blue-500 rounded-md text-white font-medium"
                >
                  {loading ? (
                    <LoaderCircle className="animate-spin"></LoaderCircle>
                  ) : (
                    "Pay"
                  )}
                </button>
              </div>
            </form>
        </div>
    </div>
  )
}

export default MonthlyBillPay