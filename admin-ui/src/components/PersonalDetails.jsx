import React, { useEffect, useRef, useState } from 'react'

//Import icons
import { LoaderCircle, Pencil, X } from 'lucide-react';
import { Lock } from 'lucide-react';
import { toast } from 'react-toastify'

//Import images
import USER from '../assets/user.png'
import { getAdminDetails, uploadAdminLogo } from '../services/adminService';

import ProfileForm from './ProfileForm';
import ChangePassword from './ChangePassword';

function PersonalDetails() {
  const logoInputRef = useRef(null)
  const [userDetails,setUserDetails] = useState(false)
  const [file,setFile] = useState(null)
  const [preview,setPreview] = useState(null)
  const [logoLoader,setLogoLoader] = useState(false)
  const [openProfileForm,setOpenProfileForm] = useState(false)
  const [openPasswordForm,setOpenPasswordForm] = useState(false)


  const handleFileChange = (e) =>{
     const file = e.target.files[0]
     if(file && file.type.startsWith("image/")){
        setFile(file)
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
     }else{
        setPreview(null)
     }
  }

  const handleRemoveFile = () =>{
     setPreview(null)
     setFile(null)
     if(logoInputRef.current){
      logoInputRef.current.value = ""
     }
  }
  
  const handleGetUserDetails = async () => {
    try{
        const data = await getAdminDetails()
        setUserDetails(data)
    }catch(err){
        console.log(err)
    }
  }

  useEffect(()=>{
    handleGetUserDetails()
  },[])

  const handleUploadLogo = async () =>{
    try{
      setLogoLoader(true)
      let formData = new FormData()
      formData.append('logo',file)
      const data = await uploadAdminLogo(formData)
      await handleGetUserDetails()
      setPreview(null)
      setFile(null)
      toast.success("Logo uploaded successfully.")
    }catch(err){
      console.log(err)
      toast.error(err?.message)
    }finally{
      setLogoLoader(false)
    }
  }

  const handleCloseProfileForm = (refresh) =>{
     setOpenProfileForm(false)
     if(refresh) handleGetUserDetails()
  }

  const handleClosePasswordForm = () =>{
    setOpenPasswordForm(false)
  }


  return (
  <div className='p-3 sm:p-4 md:p-6 border border-neutral-200 bg-white rounded-md flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-12 items-center sm:items-start'>
    {openProfileForm && <ProfileForm onClose={handleCloseProfileForm} userDetails={userDetails} ></ProfileForm>}
    {openPasswordForm && <ChangePassword onClose={handleClosePasswordForm}></ChangePassword>}
    <div className='flex p-2 flex-col gap-2 sm:gap-3 items-center flex-shrink-0'>
       <div className='relative'>
         {preview && <div className='bg-red-500 rounded-full -right-1 sm:-right-2 absolute hover:bg-red-600 -top-1 p-1 flex justify-center items-center'><X onClick={handleRemoveFile} size={16} className="sm:w-5 sm:h-5 text-white cursor-pointer"></X></div>}
         <img src={preview ? preview : userDetails?.pglogo ? userDetails?.pglogo : USER} alt='profile' className='w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 border border-neutral-300 rounded-full object-cover'></img>
       </div>
       {
         preview ? 
          <button onClick={()=>handleUploadLogo()} disabled={logoLoader} className='p-1.5 sm:p-2 text-white rounded-md w-full sm:w-32 text-sm sm:text-base flex justify-center items-center bg-green-500 hover:bg-green-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors'>
            {
               logoLoader ? 
               <LoaderCircle className='animate-spin w-4 h-4 sm:w-5 sm:h-5'></LoaderCircle>
               :"Upload Logo"
            }
          </button>
         : <label htmlFor='logo' className='p-1.5 sm:p-2 transition-all duration-300 bg-[#2b80ff] hover:bg-blue-600 text-white rounded-md w-full sm:w-36 text-center cursor-pointer text-sm sm:text-base'>Add Logo</label>
       }
       <input ref={logoInputRef} onChange={handleFileChange} type='file' className='hidden' id='logo'></input>
    </div>
    <div className='flex-1 flex justify-between flex-col gap-4 sm:gap-6 md:gap-8 w-full sm:w-auto'>
         <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-center w-full'>
            <div className='flex flex-col gap-1.5 sm:gap-2'>
                <label className='text-sm sm:text-base text-gray-600'>Full Name</label>
                <input value={userDetails?.full_name || ''} type='text' readOnly className='p-2 sm:p-2.5 text-sm sm:text-base border rounded-md outline-none border-neutral-300 bg-gray-50'></input>
            </div>
            <div className='flex flex-col gap-1.5 sm:gap-2'>
                <label className='text-sm sm:text-base text-gray-600'>Email Address</label>
                <input value={userDetails?.email || ''} type='email' readOnly className='p-2 sm:p-2.5 text-sm sm:text-base border rounded-md outline-none border-neutral-300 bg-gray-50'></input>
            </div>
         </div>
         <div className='flex justify-end sm:place-content-end'>
            <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto'>
                 <button onClick={()=>setOpenProfileForm(true)} className='p-2 sm:p-2.5 cursor-pointer bg-gray-50 hover:bg-gray-100 rounded-md w-full sm:w-48 justify-center border border-neutral-300 flex items-center gap-2 transition-colors text-sm sm:text-base'>
                    <Pencil size={16} className="sm:w-5 sm:h-5"></Pencil>
                    <span>Edit Profile</span>
                   </button> 
                <button onClick={()=>setOpenPasswordForm(true)} className='p-2 sm:p-2.5 cursor-pointer bg-gray-50 hover:bg-gray-100 rounded-md w-full sm:w-48 justify-center border border-neutral-300 flex items-center gap-2 transition-colors text-sm sm:text-base'>
                    <Lock size={16} className="sm:w-5 sm:h-5"></Lock>
                    <span>Change Password</span>
                </button>
            </div>
         </div>
    </div>
  </div>
  )
}

export default PersonalDetails