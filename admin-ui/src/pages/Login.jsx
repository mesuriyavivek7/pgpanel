import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from '../validations/loginSchema';
import { login } from '../services/authService';
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

//Importing icons
import { LoaderCircle } from 'lucide-react';
import { Eye } from 'lucide-react';
import { EyeOff } from 'lucide-react';


//Importing image
import LOGIN from '../assets/Login1.png'

function Login() {
  const navigate = useNavigate()
  const {auth, loginSuccess, loginFailure} = useAuth()

  useEffect(()=>{
    if(auth.token && auth.user){
      navigate(auth?.user?.userType==="Admin" ? '/admin' : '/account')
    }  
  },[])

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm({
    mode:'onChange',
    resolver: zodResolver(loginSchema)
  })
  const [showPassword,setShowPassword] = useState(false)
  const [loading,setLoading] = useState(false)

  const onSubmit = async (formData) =>{
    setLoading(true)
    try{
       const data = await login(formData)
       loginSuccess(data)
       navigate(data.userType==="Admin"?"/admin":"/account")
    }catch(err){
       console.log(err.message)
       toast.error(err?.message)
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className='w-full h-screen flex items-center'>
       <div className='sm:w-1/2 w-full h-full flex justify-center items-center'> 
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
            <div className='flex mb-2 flex-col gap-1'>
               <h1 className='text-4xl font-semibold'>Harikrushna PG</h1>
               <span className='text-gray-500'>Welcome back! Please login to your account.</span>
            </div>
            <div className='flex flex-col gap-4.5'>
               <div className='flex flex-col gap-1'>
                 <label>Email Address</label>
                 <div className='flex flex-col'>
                   <input {...register("email")} type='email' className='p-2 border rounded-md  border-neutral-300 outline-none' placeholder='you@example.com'></input>
                   {errors.email && <span className='text-sm text-red-500'>{errors.email.message}</span>}
                 </div>
               </div>
               <div className='flex flex-col gap-1'>
                 <label>Password</label>
                 <div className='flex relative flex-col'>
                   <input {...register("password")} type={showPassword?"text":'password'} className='p-2 border rounded-md  border-neutral-300 outline-none' placeholder='******'></input>
                   <span onClick={()=>setShowPassword(!showPassword)} className='absolute cursor-pointer right-2 top-3 text-gray-500'>{showPassword ? <EyeOff size={20}></EyeOff> : <Eye size={20}></Eye>}</span>
                   {errors.password && <span className='text-sm text-red-500'>{errors.password.message}</span>}
                 </div>
               </div>
               <div className='flex flex-col gap-1'>
                 <label>User Type</label>
                 <div className='flex flex-col'>
                   <select {...register("userType")} className='p-2 border rounded-md border-neutral-300 outline-none'>
                    <option value={'Admin'}>Admin</option>
                    <option value={'Account'}>Accountant</option>
                   </select>
                   {errors.userType && <span className='text-sm text-red-500'>{errors.userType.message}</span>}
                 </div>
               </div>
            </div>
            <button disabled={loading} type='submit' className='p-2 hover:bg-blue-600 transition-all duration-300 cursor-pointer flex justify-center items-center bg-blue-500 rounded-md text-white font-medium'>
               {
                loading ? 
                <LoaderCircle className='animate-spin'></LoaderCircle>
                :"Log in"
               }
            </button>
          </form>
       </div>
       <div className='w-1/2 hidden  md:flex flex-col justify-center items-center h-full bg-gradient-to-bl from-[#296ceb] via-[#2589db] to-[#1FABC8]'>
          <img src={LOGIN}></img>
          <div className='w-full py-2 px-6 flex flex-col gap-1'>
             <h1 className='text-3xl font-semibold text-white'>Modern Living, Unmatched Comfort.</h1>
             <p className='text-neutral-100 font-light'>Discover a new state of co-living with state-of-the-art amenities and a vibrant community.</p>
          </div>
       </div>
    </div>
  )
}

export default Login