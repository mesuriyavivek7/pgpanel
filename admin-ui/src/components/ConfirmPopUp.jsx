import { LoaderCircle } from 'lucide-react'
import React from 'react'

function ConfirmPopUp({
  onClose,
  buttonText,
  onAction,
  confirmText,
  loading=false,
}) {
  return (
    <div className='fixed z-50 backdrop-blur-sm inset-0 bg-black/40 flex justify-center items-center'>
        <div className='flex bg-white rounded-2xl p-4 flex-col gap-2'>
            <h1 className='text-xl font-semibold'>Confirmation</h1>
            <p>{confirmText}</p>
            <div className='flex place-content-end'>
                <div className='flex justify-center items-center gap-2'>
                    <button 
                    onClick={()=>onClose(false)}
                    className='px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300'
                    >Cancel</button>
                    <button 
                    disabled={loading}
                    onClick={()=>{
                        onAction()
                    }}
                    className='px-4 flex justify-center items-center w-28 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
                    >
                      { loading ? 
                        <LoaderCircle className='animate-spin'></LoaderCircle>
                       : buttonText}
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ConfirmPopUp