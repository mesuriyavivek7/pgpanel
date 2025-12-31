import React , {useState} from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateAdmin } from '../services/adminService';

//Import icons
import { ChevronLeft, LoaderCircle } from 'lucide-react';

import { profileSchema } from '../validations/profileSchema';
import { toast } from 'react-toastify';

function ProfileForm({userDetails, onClose}) {
  const [loading, setLoading] = useState()  
  
  const {
    register,
    handleSubmit,
    formState: {errors},
    reset
  } = useForm({
    mode:'onChange',
    resolver: zodResolver(profileSchema),
    defaultValues: {
       full_name:userDetails.full_name,
       email:userDetails.email
    }
  })

  const handleEditProfileDetails = async (formData) =>{
    setLoading(true)
    try{
      const data = await updateAdmin(formData)
      onClose(true)
      toast.success("Profile details updated successfully.")
    }catch(err){
      console.log(err)
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className='fixed z-50 backdrop-blur-sm inset-0 bg-black/40 flex justify-center items-center'>
        <div className='flex w-xl flex-col gap-4 bg-white rounded-2xl p-4'>
          <div className='flex items-center gap-2'>
              <ChevronLeft size={28} onClick={()=>onClose(false)} className="cursor-pointer"></ChevronLeft>
              <h1 className="text-2xl font-semibold">{"Edit Details"}</h1>
          </div>
          <form onSubmit={handleSubmit(handleEditProfileDetails)} className='flex flex-col gap-4'>
              <div className='flex flex-col gap-2'>
                <label>Full Name <span className='text-sm text-red-500'>*</span></label>
                <div className='flex flex-col'>
                   <input
                    type='text'
                    {...register("full_name")}
                    className='p-2 border border-neutral-300 rounded-md outline-none'
                    placeholder='Enter full name'
                    ></input>
                    {errors.full_name && <span className='text-sm text-red-500'>{errors.full_name.message}</span>}
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                <label>Email <span className='text-sm text-red-500'>*</span></label>
                <div className='flex flex-col'>
                   <input
                    type='text'
                    {...register("email")}
                    className='p-2 border border-neutral-300 rounded-md outline-none'
                    placeholder='Enter email address'
                    ></input>
                    {errors.email && <span className='text-sm text-red-500'>{errors.email.message}</span>}
                </div>
             </div>
             <div className="flex justify-center items-center">
               <button type="submit" disabled={loading} className="p-2 hover:bg-blue-600 disabled:cursor-not-allowed w-36 transition-all duration-300 cursor-pointer flex justify-center items-center bg-blue-500 rounded-md text-white font-medium">
                {
                  loading ? 
                  <LoaderCircle className="animate-spin"></LoaderCircle> :
                   "Save"
                }
              </button>
            </div>
          </form>
        </div>
    </div>
  )
}

export default ProfileForm