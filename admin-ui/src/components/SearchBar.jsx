import React, { useEffect } from 'react'
import { useState, useRef } from 'react';

import { toast } from 'react-toastify';
import SearchItem from './SearchItem';

//Importing icons
import { LoaderCircle, Search } from 'lucide-react';
import EMPTY from '../assets/empty.png'

import { getDashboardSearch } from '../services/adminService';

function SearchBar({setOpenSearchBar}) {
  const [activeTab,setActiveTab] = useState('Customers')
  const [searchResults,setSearchResults] = useState([])
  const [searchQuery,setSearchQuery] = useState('')
  const [loading,setLoading] = useState(false)

  const wrapperRef = useRef(null)

  useEffect(()=>{
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpenSearchBar(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  })

  const handleGetDashboardSearch = async (role, query) =>{
    setLoading(true)
    try{
       const data = await getDashboardSearch(role, query)
       console.log(data)
       setSearchResults(data)
    }catch(err){
       console.log(err)
       toast.error(err?.message)
    }finally{
        setLoading(false)
    }
  }

  useEffect(()=>{
     handleGetDashboardSearch(activeTab, searchQuery)
  },[searchQuery])

  return (
    <div className='fixed z-50 backdrop-blur-sm inset-0 bg-black/40 flex justify-center items-start sm:items-center px-4 py-4 sm:py-8 overflow-y-auto'>
        <div ref={wrapperRef} className='mx-auto mt-4 sm:mt-0 flex w-full max-w-2xl flex-col bg-white rounded-xl sm:rounded-2xl max-h-[90vh] overflow-hidden flex-shrink-0'>
            <div className='w-full border-b border-neutral-300 p-3 sm:p-4 flex items-center gap-2 sm:gap-3'>
                <Search size={16} className='sm:w-5 sm:h-5 text-gray-500 flex-shrink-0'></Search>
                <input 
                  onChange={(e)=>setSearchQuery(e.target.value)} 
                  autoFocus 
                  type='text' 
                  className='outline-none h-8 sm:h-9 w-full text-sm sm:text-base placeholder:text-gray-400' 
                  placeholder='Search for anything...'
                ></input>
            </div>
            <div className='p-3 sm:p-4 flex flex-col gap-3 sm:gap-4'>
               <div className='flex items-center w-full'>
                 <button 
                   onClick={()=>setActiveTab('Customers')} 
                   className={`flex-1 p-2 sm:p-2.5 text-xs sm:text-sm font-medium transition-colors ${
                     activeTab==="Customers" 
                       ? "bg-[#2b7fff] text-white" 
                       : "bg-white text-gray-700 hover:bg-gray-50"
                   } border-neutral-300 cursor-pointer border rounded-l-lg sm:rounded-l-2xl`}
                 >
                   <span>Customers</span>
                 </button>
                 <button 
                   onClick={()=>setActiveTab('Employees')} 
                   className={`flex-1 p-2 sm:p-2.5 text-xs sm:text-sm font-medium transition-colors ${
                     activeTab==="Employees" 
                       ? "bg-[#2b7fff] text-white" 
                       : "bg-white text-gray-700 hover:bg-gray-50"
                   } cursor-pointer border-t border-b border-neutral-300`}
                 >
                   <span>Employees</span>
                 </button>
                 <button 
                   onClick={()=>setActiveTab('Ac Managers')} 
                   className={`flex-1 p-2 sm:p-2.5 text-xs sm:text-sm font-medium transition-colors ${
                     activeTab==="Ac Managers" 
                       ? "bg-[#2b7fff] text-white" 
                       : "bg-white text-gray-700 hover:bg-gray-50"
                   } cursor-pointer border border-neutral-300 rounded-r-lg sm:rounded-r-2xl`}
                 >
                   <span>Ac Managers</span>
                 </button>
               </div>
            </div>
            <div className='min-h-[200px] sm:h-96 max-h-[50vh] sm:max-h-96 w-full overflow-y-auto scroll-smooth'>
                {
                    loading ? (
                        <div className='w-full h-full min-h-[200px] flex justify-center items-center p-4'>
                           <LoaderCircle size={24} className='sm:w-7 sm:h-7 animate-spin text-blue-500'></LoaderCircle>
                        </div>
                    ) : searchResults.length === 0 ? (
                        <div className='w-full h-full min-h-[200px] flex justify-center items-center p-4'>
                           <img src={EMPTY} className='h-24 w-24 sm:h-32 sm:w-32 object-contain'></img>
                       </div>
                    ) : (
                        <div className='flex flex-col gap-2 sm:gap-3 p-3 sm:p-4 pb-4 sm:pb-6'>
                            {
                                searchResults.map((item, index)=>(
                                   <SearchItem key={index} role={activeTab} item={item} ></SearchItem>
                                ))
                            }
                        </div>
                    )
                }
            </div>
        </div>
    </div>
  )
}

export default SearchBar