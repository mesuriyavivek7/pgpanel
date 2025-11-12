import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

//Importing icons
import { Image } from 'lucide-react';
import { Building2 } from 'lucide-react';
import { SquarePen } from 'lucide-react';


function BranchCard({openForm,item}) {
  const navigate = useNavigate()
  const {auth} = useAuth()

  const handleClick = (item) =>{
    navigate(auth.user.userType === 'Admin' ?  '/admin/branches/preview' : '/account/branches/preview',{state:item._id})
  }

  return (
    <div
      onClick={()=>handleClick(item)}
      className="rounded-xl sm:rounded-2xl relative hover:scale-[1.02] transition-all duration-300 overflow-hidden shadow-sm border cursor-pointer border-neutral-300"
    >
      {
        auth.user.userType === "Admin" && 
        <div className="absolute p-1 sm:p-1.5 right-2 top-2 hover:bg-black/80 transition-all duration-300 bg-black/40 backdrop-blur-sm rounded-md">
         <SquarePen 
         onClick={(e)=>{
          e.stopPropagation()
          openForm(item)
        }} className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-white"></SquarePen>
       </div> 
      }
      {item.branch_image ? (
        <img className="h-40 sm:h-48 object-cover w-full" src={item.branch_image}></img>
      ) : (
        <div className="bg-gradient-to-br from-[#5f9df9] to-[#636ef2] w-full h-40 sm:h-48 flex justify-center items-center">
          <Image className="w-8 h-8 sm:w-10 sm:h-10 text-white"></Image>
        </div>
      )}
      <div className="p-3 sm:p-4 bg-white flex flex-col gap-1.5 sm:gap-2">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"></Building2>
          <span className="text-sm sm:text-base font-medium truncate">{item.branch_name}</span>
        </div>
        <span className="text-gray-500 text-xs sm:text-sm line-clamp-2">{item?.branch_address}</span>
      </div>
    </div>
  );
}

export default BranchCard;
