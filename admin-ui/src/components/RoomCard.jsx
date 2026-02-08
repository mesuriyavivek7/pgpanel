import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

//importing icons
import { MoreVertical, SquarePen, Trash2 } from 'lucide-react'

function RoomCard({openForm, room, onDelete}) {
  const {auth} = useAuth()
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef(null)

  const navigate = useNavigate()

  const handleNavigate = () =>{
     navigate(auth.user.userType === "Account" ? '/account/branches/room/preview' : "/admin/branches/room/preview", {state:room._id})
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  const handleEdit = (e) => {
    e.stopPropagation()
    setShowMenu(false)
    openForm(room)
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    setShowMenu(false)
    onDelete(room)
  }

  return (
    <div onClick={handleNavigate} className='relative h-28 sm:h-32 md:h-36 hover:scale-[1.02] transition-all duration-300 cursor-pointer rounded-xl sm:rounded-2xl shadow-sm bg-gradient-to-br from-[#d8e8fe] to-[#c3ddfe] flex flex-col justify-between gap-2 sm:gap-3 md:gap-4 p-3 sm:p-4'>
       <div className="absolute right-2 top-2" ref={menuRef}>
         <div 
           onClick={(e) => {
             e.stopPropagation()
             setShowMenu(!showMenu)
           }}
           className="p-1 sm:p-1.5 hover:bg-black/80 transition-all duration-300 bg-black/40 backdrop-blur-sm rounded-md cursor-pointer"
         >
           <MoreVertical className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-white"></MoreVertical>
         </div>
         {showMenu && (
           <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg py-1 min-w-[120px] z-10 border border-gray-200">
             <button
               onClick={handleEdit}
               className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-sm"
             >
               <SquarePen className="w-4 h-4 text-gray-600"></SquarePen>
               <span>Edit</span>
             </button>
             <button
               onClick={handleDelete}
               className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-sm text-red-600"
             >
               <Trash2 className="w-4 h-4"></Trash2>
               <span>Delete</span>
             </button>
           </div>
         )}
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