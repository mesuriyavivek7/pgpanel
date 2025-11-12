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
    <div className='fixed z-50 backdrop-blur-sm inset-0 bg-black/40 flex justify-center items-center px-4 py-4 sm:px-6 sm:py-6'>
        <div className='flex w-full max-w-xl flex-col gap-3 sm:gap-4 bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 max-h-[90vh] overflow-y-auto'>
           <div className='flex items-center gap-2'>
              <ChevronLeft size={24} className="sm:w-7 sm:h-7 cursor-pointer flex-shrink-0" onClick={()=>onClose(false)}></ChevronLeft>
              <h1 className="text-lg sm:text-xl md:text-2xl font-semibold break-words">Pay Monthly Bill</h1>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 items-center gap-3 sm:gap-4'>
                <div className='flex items-center gap-2'>
                    <ReceiptText className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"></ReceiptText>
                    <span className='text-sm sm:text-base md:text-lg font-medium break-words'>{monthlyBill.billName}</span>
                </div>
                <div className='flex items-center gap-2'>
                    <Wallet className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"></Wallet>
                    <span className='text-sm sm:text-base md:text-lg font-medium'>₹{monthlyBill.amount}</span>
                </div>
                <div className='flex items-center gap-2'>
                    <House className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"></House>
                    <span className='text-sm sm:text-base md:text-lg font-medium break-words'>{sliceString(monthlyBill.branch.branch_name,20)}</span>
                </div>
                <div className='flex items-center gap-2'>
                    <NotebookPen className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"></NotebookPen>
                    <span className='text-sm sm:text-base md:text-lg font-medium break-words'>{sliceString(monthlyBill.notes,20)}</span>
                </div>
            </div>
            <form onSubmit={handleSubmit(handlePayMonthlyBill)} className='flex flex-col gap-3 sm:gap-4'>
               <div className='flex flex-col gap-1.5 sm:gap-2'>
                 <label className='text-sm sm:text-base font-medium'>Pending Amount</label>
                 <span className='text-sm sm:text-base md:text-lg font-medium'>₹{selectedAmount?.pending || 0}</span>
               </div>
               <div className='flex flex-col gap-1.5 sm:gap-2'>
                 <label className='text-sm sm:text-base'>Amount <span className='text-sm text-red-500'>*</span></label>
                  <div className='flex flex-col'>
                  <input 
                   {...register('amount',{valueAsNumber:true})}
                   type='number'
                   placeholder='Enter amount'
                   className='p-2 sm:p-2.5 text-sm sm:text-base border border-neutral-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                   ></input>
                   {errors.amount && <span className='text-xs sm:text-sm text-red-500 mt-1'>{errors.amount.message}</span>}
                  </div>
               </div>
               <div className="flex flex-col gap-1.5 sm:gap-2">
                <label className='text-sm sm:text-base'>
                  Select Month/Year{" "}
                  <span className="text-sm text-red-500">*</span>
                </label>
                <div className="flex flex-col">
                  <select
                    {...register("date")}
                    onChange={handleSelectAmount}
                    className="p-2 sm:p-2.5 text-sm sm:text-base border border-neutral-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {
                      monthlyBill?.pendingMonths.map((item,index)=>(
                         <option key={index} value={`${item.month}-${item.year}`}>{`${getShortMonthName(item.month)} ${item.year}`}</option>
                      ))
                   }
                  </select>
                  {errors.date && (
                    <span className="text-xs sm:text-sm text-red-500 mt-1">
                      {errors.date.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <label className='text-sm sm:text-base'>Select Payment Mode <span className="text-sm text-red-500">*</span></label>
                <div className="flex flex-col">
                  <select
                    {...register("payment_mode")}
                    className="p-2 sm:p-2.5 text-sm sm:text-base border border-neutral-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={""}>-- Select Payment Mode --</option>
                    <option value={"cash"}>Cash</option>
                    <option value={"upi"}>UPI</option>
                    <option value={"bank_transfer"}>Bank Transfer</option>
                  </select>
                  {errors.payment_mode && (
                    <span className="text-xs sm:text-sm text-red-500 mt-1">
                      {errors.payment_mode.message}
                    </span>
                  )}
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
              <div className='flex justify-center items-center pt-2'>
                <button
                  type="submit"
                  disabled={loading}
                  className="p-2.5 sm:p-3 hover:bg-blue-600 w-full sm:w-36 transition-all duration-300 cursor-pointer flex justify-center items-center bg-blue-500 rounded-md text-white font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <LoaderCircle className="animate-spin w-5 h-5"></LoaderCircle>
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