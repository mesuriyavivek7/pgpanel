import React, { useState, useEffect } from 'react'
import { customerAdvanceRentSchema } from '../validations/customerAdvanceRentSchema'
import { getAllBankAccount } from '../services/bankAccountService'
import { createTransactionForAdvanceRentPay } from '../services/transactionService'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft, LoaderCircle } from 'lucide-react'
import { toast } from 'react-toastify'

function CustomerAdvanceRentForm({ openForm, customer, onClose }) {
  if (!openForm) return null

  const [bankAccounts, setBankAccounts] = useState([])
  const [monthOptions, setMonthOptions] = useState([])
  const [loader, setLoader] = useState(false)

  const now = new Date()
  const currentMonth = now.getMonth() + 1 // 1-12
  const currentYear = now.getFullYear()

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const upcomingYears = Array.from({ length: 4 }, (_, i) => currentYear + i)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    reset
  } = useForm({
    mode: 'onChange',
    resolver: zodResolver(customerAdvanceRentSchema),
    defaultValues: {
      customer: customer?._id || '',
      amount: 0,
      // default to next month; if next month rolls to next year it will be correct
      month: (currentMonth === 12 ? 1 : currentMonth + 1),
      year: (currentMonth === 12 ? currentYear + 1 : currentYear),
      payment_mode: '',
      bank_account: '',
    },
  })

  useEffect(()=>{
    reset({
        customer: customer?._id || '',
        amount: 0,
        // default to next month; if next month rolls to next year it will be correct
        month: (currentMonth === 12 ? 1 : currentMonth + 1),
        year: (currentMonth === 12 ? currentYear + 1 : currentYear),
        payment_mode: '',
        bank_account: '',
    })
  },[customer])

  const watchedYear = watch('year')
  const watchedMonth = watch('month')

  const buildMonthsForYear = (year) => {
    
    if (Number(year) === currentYear) {
      const startMonth = currentMonth === 12 ? 1 : currentMonth + 1
      const months = []
      for (let m = startMonth; m <= 12; m++) {
        months.push({ value: m, label: `${monthNames[m - 1]} ${year}` })
      }
      return months
    }

    
    return Array.from({ length: 12 }, (_, i) => {
      const m = i + 1
      return { value: m, label: `${monthNames[m - 1]} ${year}` }
    })
  }

  // Initialize month options on mount & whenever year changes
  useEffect(() => {
    
    const yearNum = Number(watchedYear) || (currentMonth === 12 ? currentYear + 1 : currentYear)
    const months = buildMonthsForYear(yearNum)
    setMonthOptions(months)

    const monthSelected = Number(watchedMonth)
    const found = months.find(m => Number(m.value) === monthSelected)
    if (!found) {
      setValue('month', months[0].value, { shouldValidate: true, shouldDirty: true })
    }
  }, [watchedYear, currentMonth, currentYear]) 

  useEffect(() => {
    const handleGetBankAccounts = async () => {
      try {
        const data = await getAllBankAccount()
        setBankAccounts(data)
      } catch (err) {
        console.error(err)
        toast.error(err?.message || "Failed to load bank accounts")
      }
    }
    handleGetBankAccounts()
  }, [])

  // optional submit handler (hook up where needed)
  const onSubmit = async (formData) => {
    try{
        setLoader(true)
        const data = await createTransactionForAdvanceRentPay(formData)
        onClose(true)
        toast.success("Advance rent paid successfully.")
    }catch(err){
        console.error(err)
        toast.error(err?.message || "Something went wrong.")
    }finally{
        setLoader(false)
    }
  }

  return (
    <div className='fixed z-50 backdrop-blur-sm inset-0 bg-black/40 flex justify-center items-center px-4 py-4 sm:px-6 sm:py-6'>
      <div className='flex w-full max-w-xl flex-col gap-3 sm:gap-4 bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 max-h-[90vh] overflow-y-auto'>
        <div className="flex items-center gap-2">
          <ChevronLeft size={24} className="sm:w-7 sm:h-7 cursor-pointer flex-shrink-0" onClick={() => onClose(false)} />
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold break-words">Advance Rent Pay</h1>
        </div>

        <form className='flex flex-col gap-3 sm:gap-4' onSubmit={handleSubmit(onSubmit)}>
          {/* Amount */}
          <div className='flex flex-col gap-1.5 sm:gap-2'>
            <label className='text-sm sm:text-base'>Amount <span className='text-sm text-red-500'>*</span></label>
            <div className='flex flex-col'>
              <input
                type='number'
                {...register("amount", { valueAsNumber: true })}
                className="p-2 sm:p-2.5 text-sm sm:text-base border border-neutral-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter amount"
              />
              {errors.amount && <span className='text-xs sm:text-sm text-red-500 mt-1'>{errors.amount.message}</span>}
            </div>
          </div>

          {/* Month */}
          <div className='flex flex-col gap-1.5 sm:gap-2'>
            <label className='text-sm sm:text-base'>Select Month <span className='text-sm text-red-500'>*</span></label>
            <div className='flex flex-col'>
              <select
                {...register("month", { valueAsNumber: true })}
                value={watchedMonth}
                onChange={(e) => setValue('month', Number(e.target.value), { shouldValidate: true, shouldDirty: true })}
                className="p-2 sm:p-2.5 text-sm sm:text-base border border-neutral-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {monthOptions.map((opt, idx) => (
                  <option key={idx} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {errors.month && <span className='text-xs sm:text-sm text-red-500 mt-1'>{errors.month.message}</span>}
            </div>
          </div>

          {/* Year */}
          <div className='flex flex-col gap-1.5 sm:gap-2'>
            <label className='text-sm sm:text-base'>Select Year <span className='text-sm text-red-500'>*</span></label>
            <div className='flex flex-col'>
              <select
                {...register("year",{ valueAsNumber: true })}
                value={watchedYear || currentYear}
                onChange={(e) => {
                  const y = Number(e.target.value)
                  // update year in form; month effect will update months & fix month value if needed
                  setValue('year', y, { shouldValidate: true, shouldDirty: true })
                }}
                className="p-2 sm:p-2.5 text-sm sm:text-base border border-neutral-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Select Year --</option>
                {upcomingYears.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              {errors.year && <span className='text-xs sm:text-sm text-red-500 mt-1'>{errors.year.message}</span>}
            </div>
          </div>

          {/* Payment Mode */}
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

          {/* Bank Account */}
          <div className='flex flex-col gap-1.5 sm:gap-2'>
            <label className='text-sm sm:text-base'>Select Bank Account <span className='text-red-500 text-sm'>*</span></label>
            <div className='flex flex-col'>
              <select
                {...register('bank_account')}
                className='p-2 sm:p-2.5 text-sm sm:text-base border border-neutral-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                <option value={''}>-- Select Bank Account --</option>
                {bankAccounts.map((item, index) => (
                  <option value={item._id} key={index}>
                    {item.account_holdername}
                  </option>
                ))}
              </select>
              {errors.bank_account && <span className='text-xs sm:text-sm text-red-500 mt-1'>{errors.bank_account.message}</span>}
            </div>
          </div>

          {/* Submit button */}
          <div className="flex justify-center items-center pt-2">
            <button 
              disabled={loader} 
              type="submit" 
              className="p-2.5 sm:p-3 px-6 sm:px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium text-sm sm:text-base w-full sm:w-auto transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {loader ? (
                <>
                  <LoaderCircle className="animate-spin w-5 h-5" />
                  <span>Submitting...</span>
                </>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CustomerAdvanceRentForm
