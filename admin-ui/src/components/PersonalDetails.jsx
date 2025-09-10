import React, { useEffect, useRef, useState } from 'react'

//Import icons
import { LoaderCircle, Pencil, X } from 'lucide-react';
import { Lock } from 'lucide-react';
import { toast } from 'react-toastify'

//Import images
import USER from '../assets/user.png'
import { getAdminDetails, uploadAdminLogo } from '../services/adminService';

import ProfileForm from './ProfileForm';

function PersonalDetails() {
  const logoInputRef = useRef(null)
  const [userDetails,setUserDetails] = useState(false)
  const [file,setFile] = useState(null)
  const [preview,setPreview] = useState(null)
  const [logoLoader,setLogoLoader] = useState(false)
  const [openProfileForm,setOpenProfileForm] = useState(false)


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


  return (
  <div className='p-4 border border-neutral-200 bg-white rounded-md flex gap-12 items-center'>
    {openProfileForm && <ProfileForm onClose={handleCloseProfileForm} userDetails={userDetails} ></ProfileForm>}
    <div className='flex p-2 flex-col gap-2 items-center'>
       <div className='relative'>
         {preview && <div className='bg-red-500 rounded-full -right-2 absolute hover:bg-red-600  -top-1 p-1 flex justify-center items-center'><X onClick={handleRemoveFile} size={18} className=" text-white cursor-pointer"></X></div>}
         <img src={preview ? preview : userDetails?.pglogo ? userDetails?.pglogo : USER} alt='profile' className='w-36 h-36 border border-neutral-300 rounded-full'></img>
       </div>
       {
         preview ? 
          <button onClick={()=>handleUploadLogo()} disabled={logoLoader} className='p-1 text-white rounded-md w-32 flex justify-center items-center bg-green-500 hover:bg-green-600 cursor-pointer'>
            {
               logoLoader ? 
               <LoaderCircle className='animate-spin'></LoaderCircle>
               :"Upload Logo"
            }
          </button>
         : <label htmlFor='logo' className='p-1 transition-all duration-300 bg-[#2b80ff] hover:bg-blue-600 text-white rounded-md w-36 text-center cursor-pointer'>Add Logo</label>
       }
       <input ref={logoInputRef} onChange={handleFileChange} type='file' className='hidden' id='logo'></input>
    </div>
    <div className='flex-1 flex justify-between flex-col gap-8'>
         <div className='grid grid-cols-2 gap-4 items-center'>
            <div className='flex flex-col gap-2'>
                <label className='text-gray-600'>Full Name</label>
                <input value={userDetails?.full_name} type='text' readOnly className='p-2 border rounded-md outline-none border-neutral-300'></input>
            </div>
            <div className='flex flex-col gap-2'>
                <label className='text-gray-600'>Email Address</label>
                <input value={userDetails?.email} type='text' readOnly className='p-2 border rounded-md outline-none border-neutral-300'></input>
            </div>
         </div>
         <div className='flex place-content-end'>
            <div className='flex items-center gap-4'>
                 <button onClick={()=>setOpenProfileForm(true)} className='p-2 cursor-pointer bg-gray-50 hover:bg-gray-100 rounded-md w-48 justify-center border border-neutral-300 flex items-center gap-2'>
                    <Pencil size={18}></Pencil>
                    <span className='text-sm'>Edit Profile</span>
                   </button> 
                <button className='p-2 cursor-pointer bg-gray-50 hover:bg-gray-100 rounded-md w-48 justify-center border border-neutral-300 flex items-center gap-2'>
                    <Lock size={18}></Lock>
                    <span className='text-sm'>Change Password</span>
                </button>
            </div>
         </div>
    </div>
  </div>
  )
}

export default PersonalDetails