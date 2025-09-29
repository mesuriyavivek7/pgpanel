import React, { useState } from 'react'

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
    <div className='fixed z-50 backdrop-blur-sm inset-0 bg-black/40 flex justify-center items-center'>
        <div className='p-4 bg-white rounded-2xl flex w-base flex-col gap-4'>
           <div className='flex items-center gap-4'>
             <img alt='warning' className='w-15 h-15' src={DELETE}></img>
             <div className='flex flex-col'>
                <span className='text-2xl font-medium'>Confirm Deletion</span>
                <span className='text-gray-500'>Are you sure to want to delete monthly bill?</span>
             </div>
           </div>
           <div className='flex place-content-end'>
             <div className='flex items-center gap-2'>
                <button onClick={()=>onClose(false)} className='p-1.5 border cursor-pointer hover:bg-gray-200 transition-all duration-300 rounded-md w-28 border-neutral-300 text-black'>Cancel</button>
                <button disabled={loader} onClick={handleDeleteMonthlyBill} className='p-1.5 disabled:cursor-not-allowed cursor-pointer rounded-md w-28 transition-all duration-300 bg-red-500 text-white hover:bg-red-600'>Delete</button>
             </div>
           </div>
        </div>
    </div>
  )
}

export default ConfirmationBox