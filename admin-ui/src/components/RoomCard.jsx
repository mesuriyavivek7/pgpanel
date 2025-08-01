import React from 'react'
import { useNavigate } from 'react-router-dom'

//importing icons
import { SquarePen } from 'lucide-react'

function RoomCard({openForm,room}) {
  const navigate = useNavigate()

  const handleNavigate = () =>{
     navigate('/admin/branches/room/preview', {state:room._id})
  }

  return (
    <div onClick={handleNavigate} className='relative h-36 hover:scale-[1.02] transition-all duration-300 cursor-pointer rounded-2xl shadow-sm bg-gradient-to-br from-[#d8e8fe] to-[#c3ddfe] flex flex-col justify-between gap-4 p-4'>
       <div className="absolute p-1 right-2 top-2 hover:bg-black/80 transition-all duration-300 bg-black/40 backdrop-blur-sm rounded-md">
         <SquarePen 
         onClick={(e)=>{
          e.stopPropagation()
          openForm(room)
        }} size={18} className="text-white"></SquarePen>
      </div>
       <h1 className='text-3xl text-[#36454F] font-bold'>{room.room_id}</h1>
       <div className='flex flex-col'>
         <span>Room {room.room_id}</span>
         <span className='text-gray-500'>Capacity {room.capacity}</span>
       </div>
    </div>
  )
}

export default RoomCard