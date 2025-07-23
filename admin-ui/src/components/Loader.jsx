import React from 'react'

import { LoaderCircle } from 'lucide-react'

function Loader() {
  return (
    <div className='w-full h-screen flex justify-center items-center'>
         <LoaderCircle size={36} className='animate-spin text-blue-500'></LoaderCircle>
    </div>
  )
}

export default Loader