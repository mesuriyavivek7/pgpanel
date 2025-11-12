import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { getRoomByBranchId } from '../services/roomService'

//Importing icons
import { LoaderCircle, Plus } from 'lucide-react'
import { BedSingle } from 'lucide-react';
import RoomCard from './RoomCard';
import RoomForm from './RoomForm';

function BranchRooms({branchId}) {
  const [rooms,setRooms] = useState([])
  const [loading,setLoading] = useState(false)
  const [openForm,setOpenForm] = useState(false)
  const [selectedRoom,setSelectedRoom] = useState(null)


  const handleGetAllRooms = async ()=>{
    setLoading(true)
    try{
      const data = await getRoomByBranchId(branchId)
      setRooms(data)
    }catch(err){
      toast.error(err?.message)
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    handleGetAllRooms()
  },[])

  const handleOpenForm = (room=null) =>{
     setOpenForm(true)
     setSelectedRoom(room)
  }

  const handleCloseForm = (refresh = false) =>{
     setOpenForm(false)
     setSelectedRoom(null)
     if(refresh) handleGetAllRooms()
  }


  return (
    <div className='flex flex-col gap-4 sm:gap-6 md:gap-8'>
         {openForm && <RoomForm branchId={branchId} onClose={handleCloseForm} selectedRoom={selectedRoom}></RoomForm>}
         <div className='flex items-center justify-between'>
             <h1 className='text-xl sm:text-2xl font-semibold'>Rooms</h1>
             <button onClick={()=>handleOpenForm(null)} className='p-1.5 md:p-2 bg-blue-500 transition-all duration-300 hover:bg-blue-600 font-medium cursor-pointer backdrop-blur-md rounded-md text-white flex-shrink-0'>
               <span className='hidden md:block'>Add New Room</span>
               <Plus className='block md:hidden w-5 h-5'></Plus>
             </button>
         </div>
         {
          loading ? 
          <div className='flex h-32 sm:h-36 justify-center items-center'>
             <LoaderCircle className='animate-spin text-blue-500 w-8 h-8 sm:w-9 sm:h-9'></LoaderCircle>
          </div>
          :rooms.length === 0 ?
          <div className='flex h-32 sm:h-36 justify-center items-center'>
              <div className='flex items-center flex-col gap-1 sm:gap-2'>
                 <BedSingle className='text-gray-500 w-6 h-6 sm:w-8 sm:h-8'></BedSingle>
                 <span className='text-gray-500 text-sm sm:text-base'>No Rooms Found.</span>
              </div>
          </div> :
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-stretch gap-3 sm:gap-4'>
             {
               rooms.map((room, index)=> (
                 <RoomCard openForm={handleOpenForm} key={index} room={room}></RoomCard>
               ))
             }
          </div>
         }

    </div>
  )
}

export default BranchRooms