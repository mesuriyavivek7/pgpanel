import { Plus, Search } from 'lucide-react'
import React from 'react'
import { useLocation } from 'react-router-dom'

function Breadcrumb({searchQuery,setSearchQuery,onClick}) {

  const location = useLocation()

  const getContent = () =>{
    switch(location.pathname){
      case '/admin':
        return <h1 className='text-3xl font-semibold'>Dashboard</h1>

      case '/admin/branches':
        return <div className='flex justify-between items-center w-full'>
          <h1 className='text-2xl md:text-3xl font-semibold'>Branches</h1>
          <div className='flex items-center gap-2'>
            <div className='border rounded-2xl border-neutral-300 bg-white p-1.5 md:p-2 w-48 md:w-72  flex items-center gap-2'>
               <Search className='text-gray-500' size={20}></Search>
               <input value={searchQuery} onChange={(e)=> setSearchQuery(e.target.value)} type='text' className='flex-1 outline-none' placeholder='Search branch'></input>
            </div>
            <button onClick={()=>onClick()} className='md:p-2 p-1.5 bg-blue-500 transition-all duration-300 text-sm md:text-base hover:bg-blue-600 font-medium cursor-pointer backdrop-blur-md rounded-md text-white'>
              <span className='hidden md:block'>Add New Branch</span>
              <Plus className='block md:hidden'></Plus>
            </button>
          </div>
        </div>
       
      case '/admin/branches/preview':
        return <div className='flex w-full flex-col gap-1'>
           <h1 className='text-2xl md:text-3xl font-semibold'>Branch Preview</h1>
           <span className='text-gray-400'>View and manage details for your branch.</span>
        </div> 

      case '/admin/customers':
        return <div className='flex justify-between items-center w-full'>
        <h1 className='text-2xl md:text-3xl font-semibold'>Customers</h1>
        <div className='flex items-center gap-2'>
          <div className='border rounded-2xl border-neutral-300 bg-white p-1.5 md:p-2 w-48 md:w-72  flex items-center gap-2'>
             <Search className='text-gray-500' size={20}></Search>
             <input value={searchQuery} onChange={(e)=> setSearchQuery(e.target.value)} type='text' className='flex-1 outline-none' placeholder='Search customers'></input>
          </div>
          <button onClick={()=>onClick()} className='md:p-2 p-1.5 bg-blue-500 transition-all duration-300 text-sm md:text-base hover:bg-blue-600 font-medium cursor-pointer backdrop-blur-md rounded-md text-white'>
            <span className='hidden md:block'>Add New Customer</span>
            <Plus className='block md:hidden'></Plus>
          </button>
        </div>
      </div>

    }
  }

  return (
    <div className='p-2'>
        {getContent()}
    </div>
  )
}

export default Breadcrumb