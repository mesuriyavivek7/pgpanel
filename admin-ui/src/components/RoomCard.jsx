import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

//importing icons
import { SquarePen } from 'lucide-react'

function RoomCard({openForm,room}) {
  const {auth} = useAuth()

  const navigate = useNavigate()

  const handleNavigate = () =>{
     navigate(auth.user.userType === "Account" ? '/account/branches/room/preview' : "/admin/branches/room/preview", {state:room._id})
  }

  return (
    <div onClick={handleNavigate} className='relative h-28 sm:h-32 md:h-36 hover:scale-[1.02] transition-all duration-300 cursor-pointer rounded-xl sm:rounded-2xl shadow-sm bg-gradient-to-br from-[#d8e8fe] to-[#c3ddfe] flex flex-col justify-between gap-2 sm:gap-3 md:gap-4 p-3 sm:p-4'>
       <div className="absolute p-1 sm:p-1.5 right-2 top-2 hover:bg-black/80 transition-all duration-300 bg-black/40 backdrop-blur-sm rounded-md">
         <SquarePen 
         onClick={(e)=>{
          e.stopPropagation()
          openForm(room)
        }} className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-white"></SquarePen>
      </div>
       <h1 className='text-2xl sm:text-3xl md:text-4xl text-[#36454F] font-bold'>{room.room_id}</h1>
       <div className='flex flex-col gap-0.5 sm:gap-1'>
         <span className='text-xs sm:text-sm md:text-base'>Room {room.room_id}</span>
         <span className='text-gray-500 text-xs sm:text-sm md:text-base'>Capacity {room.capacity}</span>
       </div>
    </div>
  )
}

export default RoomCard