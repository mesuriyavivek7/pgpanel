import React, { useEffect } from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

//import icon
import { Search } from 'lucide-react';
import { Bell } from 'lucide-react';
import { Menu } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { User } from 'lucide-react';
import Tooltip from '@mui/material/Tooltip';

import SearchBar from './SearchBar';

import { logout } from '../services/authService';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';


function Header({setShowSideBar}) {
  const {setAuth} = useAuth()
  const [openSearchBar,setOpenSearchBar] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () =>{
    try{
      const data = await logout()
      setAuth({
        loading:false,
        token:null,
        user:null
      })
      navigate('/login')
    }catch(err){
      console.log(err)
      toast.error(err?.message)
    }
  }

  const handleNavigateProfile = () =>{
     navigate('profile')
  }

  return (
    <>
    {openSearchBar && <SearchBar setOpenSearchBar={setOpenSearchBar}></SearchBar>}
    <div className='h-16 p-2 flex justify-between items-center px-4 md:px-8 fixed top-0 right-0 left-0 md:left-64 bg-white z-10 border-b border-neutral-200'>
       <div className='flex items-center gap-4'>
         <Menu className='md:hidden block' onClick={()=>setShowSideBar((prev)=> !prev)}></Menu>
         <div className='bg-[#F9FAFB] border w-52 md:w-96 border-neutral-200 px-2 rounded-md flex items-center gap-2'>
           <Search size={16} className='text-gray-500'></Search>
           <input onFocus={()=>setOpenSearchBar(true)} type='text' className='outline-none h-8 text-sm' placeholder='Search for anything...'></input>
         </div>
       </div>
       <div className='flex items-center gap-4'>
         <Tooltip onClick={handleNavigateProfile} title="profile">
          <User size={20} className='text-gray-500 cursor-pointer'></User>
         </Tooltip>
         <Tooltip title="notifications">
         <Bell size={20} className='text-gray-500 cursor-pointer'></Bell>
         </Tooltip>
         <Tooltip title="logout">
         <LogOut onClick={handleLogout} className='cursor-pointer text-red-500' size={20}></LogOut>
         </Tooltip>
       </div>
    </div>
    </>
  )
}

export default Header