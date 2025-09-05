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
    <div className='fixed z-50 backdrop-blur-sm inset-0 bg-black/40 '>
        <div ref={wrapperRef} className='mx-auto mt-[10%] flex w-xl flex-col bg-white rounded-2xl'>
            <div className='w-full border-b border-neutral-300 p-4 flex items-center gap-2'>
                <Search size={16} className='text-gray-500'></Search>
                <input onChange={(e)=>setSearchQuery(e.target.value)} autoFocus type='text' className='outline-none h-8 w-full text-sm' placeholder='Search for anything...'></input>
            </div>
            <div className='p-4 flex flex-col gap-4'>
               <div className='flex items-center'>
                 <button onClick={()=>setActiveTab('Customers')} className={`p-2 ${activeTab==="Customers" && "bg-[#2b7fff] text-white"} border-neutral-300 cursor-pointer border rounded-l-2xl`}>
                   <span>Customers</span>
                 </button>
                 <button onClick={()=>setActiveTab('Employees')} className={`p-2 ${activeTab==="Employees" && "bg-[#2b7fff] text-white"} cursor-pointer border-t border-neutral-300 border-b`}>
                   <span>Employees</span>
                 </button>
                 <button onClick={()=>setActiveTab('Ac Managers')} className={`p-2 ${activeTab==="Ac Managers" && "bg-[#2b7fff] text-white"} cursor-pointer border border-neutral-300 rounded-r-2xl`}>
                   <span>Ac Managers</span>
                 </button>
               </div>
            </div>
            <div className='h-96 w-full scroll-smooth overflow-scroll'>
                {
                    loading ? (
                        <div className='w-full h-full flex justify-center items-center'>
                           <LoaderCircle size={28} className='animate-spin text-blue-500'></LoaderCircle>
                        </div>
                    ) : searchResults.length === 0 ? (
                        <div className='w-full h-full flex justify-center items-center'>
                           <img src={EMPTY} className='h-32 w-32 object-contain'></img>
                       </div>
                    ) : (
                        <div className='flex flex-col gap-2 px-4'>
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