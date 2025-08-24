import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Breadcrumb from '../../components/Breadcrumb'
import { toast } from 'react-toastify'
import { getBranchById, getDashboardSummery } from '../../services/branchService'
import BranchRooms from '../../components/BranchRooms'

//Importing icons
import { Image } from 'lucide-react';

function BranchPreview() {
  const location = useLocation()
  const navigate = useNavigate()
  const [branch,setBranch] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dashboardData,setDashboardData] = useState({
   totalRooms:0,
   totalCustomers:0,
   totalEmployees:0
  })

  const handleGetDashboardSummery = async () =>{
    setLoading(true)
    try{
      const data = await getDashboardSummery(location.state)
      setDashboardData(data)
    }catch(err){
      toast.error(err?.message)
    }finally{
      setLoading(false)
    }
  }

  const handleGetBranch = async () =>{
     setLoading(true)
     try{
        const data = await getBranchById(location.state)
        setBranch(data)
     }catch(err){
        toast.error(err?.message)
     }finally{
        setLoading(false)
     }
  }

  useEffect(()=>{
    if(location.state){
      handleGetBranch()
      handleGetDashboardSummery()
    }else{
      navigate('/admin')
    }
  },[location.state])

  return (
    <div className='flex flex-col px-8 gap-8'>
        <Breadcrumb></Breadcrumb>

        {/* Branch Details */}
        <div className='flex bg-[#edf2f7] overflow-hidden items-stretch gap-8 rounded-2xl'>
            <div className='w-1/3'>
              {
               branch?.branch_image ?
               <img className='object-cover h-full w-full' src={branch?.branch_image}></img>
               :<div className="bg-gradient-to-br from-[#5f9df9] to-[#636ef2] w-full h-full flex justify-center items-center">
                 <Image size={40} className="text-white"></Image>
                </div>
              }
            </div>
            <div className='w-3/5 p-8'>
               <div className='w-full flex flex-col gap-8'>
                 <div className='flex flex-col gap-1'>
                   <h1 className='text-2xl font-semibold'>{branch?.branch_name}</h1>
                   <span className='text-[#98a3b3]'>{branch?.branch_address}</span>
                 </div>
                 <div className='grid grid-cols-3 gap-4 items-stretch'>
                    <div className='flex border-r border-neutral-300 flex-col gap-2'>
                       <span className='text-lg text-gray-500'>Customers</span>
                       <h1 className='text-3xl font-bold'>{dashboardData.totalCustomers}</h1>
                    </div>
                    <div className='flex border-r border-neutral-300 flex-col gap-2'>
                       <span className='text-lg text-gray-500'>Rooms</span>
                       <h1 className='text-3xl font-bold'>{dashboardData.totalRooms}</h1>
                    </div>
                    <div className='flex flex-col gap-2'>
                       <span className='text-lg text-gray-500'>Employees</span>
                       <h1 className='text-3xl font-bold'>{dashboardData.totalEmployees}</h1>
                    </div>
                 </div>
               </div>
            </div>
        </div>
        {/* Branch Rooms */}
        <BranchRooms branchId={location.state}></BranchRooms>
    </div>
  )
}

export default BranchPreview