import React, { useState } from 'react'
import { LoaderCircle } from 'lucide-react'

//Importing image
import DELETE from '../assets/warning.png'
import { toast } from 'react-toastify'
import { deleteMonthlyBill } from '../services/monthlyBillService'

function ConfirmationBox({onClose, monthlyBill}) {
  const [loader,setLoader] = useState(false)

  const handleDeleteMonthlyBill = async () =>{
    setLoader(true)
    try{
        const response = await deleteMonthlyBill(monthlyBill.billId)
        onClose(true)
    }catch(err){
        console.log(err)
        toast.error(err?.message)
    }finally{
        setLoader(false)
    }
  }

  return (
    <div className='fixed z-50 backdrop-blur-sm inset-0 bg-black/40 flex justify-center items-center px-4 py-4 sm:px-6 sm:py-6'>
        <div className='p-3 sm:p-4 md:p-6 bg-white rounded-xl sm:rounded-2xl flex w-full max-w-md flex-col gap-3 sm:gap-4'>
           <div className='flex items-start sm:items-center gap-3 sm:gap-4'>
             <img alt='warning' className='w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0' src={DELETE}></img>
             <div className='flex flex-col gap-1 sm:gap-1.5'>
                <span className='text-lg sm:text-xl md:text-2xl font-medium break-words'>Confirm Deletion</span>
                <span className='text-sm sm:text-base text-gray-500 break-words'>Are you sure to want to delete monthly bill?</span>
             </div>
           </div>
           <div className='flex justify-end sm:place-content-end'>
             <div className='flex flex-row items-stretch sm:items-center gap-2 sm:gap-2 w-full sm:w-auto'>
                <button onClick={()=>onClose(false)} className='p-2 sm:p-2.5 border cursor-pointer hover:bg-gray-200 transition-all duration-300 rounded-md w-full sm:w-28 border-neutral-300 text-black font-medium text-sm sm:text-base'>Cancel</button>
                <button disabled={loader} onClick={handleDeleteMonthlyBill} className='p-2 sm:p-2.5 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer rounded-md w-full sm:w-28 transition-all duration-300 bg-red-500 text-white hover:bg-red-600 font-medium text-sm sm:text-base flex justify-center items-center gap-2'>
                  {loader ? (
                    <>
                      <LoaderCircle className="animate-spin w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
             </div>
           </div>
        </div>
    </div>
  )
}

export default ConfirmationBox