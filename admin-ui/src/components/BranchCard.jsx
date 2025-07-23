import React from "react";
import { useNavigate } from "react-router-dom";

//Importing icons
import { Image } from 'lucide-react';
import { Building2 } from 'lucide-react';
import { SquarePen } from 'lucide-react';


function BranchCard({openForm,item}) {
  const navigate = useNavigate()

  const handleClick = (item) =>{
    navigate('/admin/branches/preview',{state:item._id})
  }

  return (
    <div
      onClick={()=>handleClick(item)}
      className="rounded-2xl relative hover:scale-[1.02] transition-all duration-300 overflow-hidden shadow-sm border cursor-pointer border-neutral-300"
    >
      <div className="absolute p-1 right-2 top-2 hover:bg-black/80 transition-all duration-300 bg-black/40 backdrop-blur-sm rounded-md">
         <SquarePen 
         onClick={(e)=>{
          e.stopPropagation()
          openForm(item)
        }} size={18} className="text-white"></SquarePen>
      </div>
      {item.branch_image ? (
        <img className="h-48 object-cover w-full" src={item.branch_image}></img>
      ) : (
        <div className="bg-gradient-to-br from-[#5f9df9] to-[#636ef2] w-full h-48 flex justify-center items-center">
          <Image size={40} className="text-white"></Image>
        </div>
      )}
      <div className="p-4 bg-white flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Building2></Building2>
          {item.branch_name}
        </div>
        <span className="text-gray-500 text-sm">{item?.branch_address}</span>
      </div>
    </div>
  );
}

export default BranchCard;
