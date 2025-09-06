import React from 'react'

//Import icons
import { Pencil } from 'lucide-react';
import { Lock } from 'lucide-react';
import { RotateCw, Plus, Trash } from 'lucide-react';


//Import images
import USER from '../../assets/user.png'

function Profile() {
  return (
    <div className='flex h-full flex-col gap-4'>
        <h1 className='text-3xl font-semibold'>Profile Details</h1>
        <div className='p-4 border border-neutral-200 bg-white rounded-md flex gap-12 items-center'>
            <div className='flex p-2 flex-col gap-2 items-center'>
               <img src={USER} alt='profile' className='w-36 h-36'></img>
               <button className='p-1 transition-all duration-300 bg-[#2b80ff] hover:bg-blue-600 text-white rounded-md w-36 cursor-pointer'>Add Logo</button>
            </div>
            <div className='flex-1 flex justify-between flex-col gap-8'>
                 <div className='grid grid-cols-2 gap-4 items-center'>
                    <div className='flex flex-col gap-2'>
                        <label className='text-gray-600'>Full Name</label>
                        <input type='text' readOnly className='p-2 border rounded-md outline-none border-neutral-300'></input>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label className='text-gray-600'>Email Address</label>
                        <input type='text' readOnly className='p-2 border rounded-md outline-none border-neutral-300'></input>
                    </div>
                 </div>
                 <div className='flex place-content-end'>
                    <div className='flex items-center gap-4'>
                        <button className='p-2 cursor-pointer bg-gray-50 hover:bg-gray-100 rounded-md w-48 justify-center border border-neutral-300 flex items-center gap-2'>
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
        <div className='p-4 border h-full border-neutral-200 bg-white rounded-md flex flex-col gap-4'>
           <div className='flex justify-between items-center'>
              <h1 className='text-2xl font-semibold'>Bank Accounts</h1>
              <div className='flex items-center gap-2'>
                 <button className='flex bg-blue-500 hover:bg-blue-600 transition-all duration-300 items-center gap-2 p-2 rounded-md'>
                    <RotateCw size={18} className='text-white'></RotateCw>
                    <span className='text-white'>Reset All Balances</span>
                 </button>
                 <button className='flex bg-blue-500 hover:bg-blue-600 transition-all duration-300 items-center gap-2 p-2 rounded-md'>
                    <Plus size={18} className='text-white'></Plus>
                    <span className='text-white'>Add Account</span>
                 </button>
              </div>
           </div>
           <div className='overflow-scroll h-68 flex flex-col gap-2'>
              <div className='flex w-full p-2 rounded-md bg-gray-50 border border-neutral-200 justify-between items-center'>
                <div className='flex flex-col gap-1'>
                    <h1>DARSHIL PATEL</h1>
                    <span className='font-bold'>₹ 12000</span>
                </div>
                <div className='flex items-center gap-2'>
                    <button className='p-2 rounded-md cursor-pointer border border-neutral-200'>
                        <Pencil size={18}></Pencil>
                    </button>
                    <button className='p-2 rounded-md cursor-pointer border border-neutral-200'>
                        <Trash size={18}></Trash>
                    </button>
                    <button className='p-2 rounded-md cursor-pointer border border-neutral-200'>
                        <RotateCw size={18}></RotateCw>
                    </button>
                </div>
              </div>
              <div className='flex w-full p-2 rounded-md bg-gray-50 border border-neutral-200 justify-between items-center'>
                <div className='flex flex-col gap-1'>
                    <h1>DARSHIL PATEL</h1>
                    <span className='font-bold'>₹ 12000</span>
                </div>
                <div className='flex items-center gap-2'>
                    <button className='p-2 rounded-md cursor-pointer border border-neutral-200'>
                        <Pencil size={18}></Pencil>
                    </button>
                    <button className='p-2 rounded-md cursor-pointer border border-neutral-200'>
                        <Trash size={18}></Trash>
                    </button>
                    <button className='p-2 rounded-md cursor-pointer border border-neutral-200'>
                        <RotateCw size={18}></RotateCw>
                    </button>
                </div>
              </div>
              <div className='flex w-full p-2 rounded-md bg-gray-50 border border-neutral-200 justify-between items-center'>
                <div className='flex flex-col gap-1'>
                    <h1>DARSHIL PATEL</h1>
                    <span className='font-bold'>₹ 12000</span>
                </div>
                <div className='flex items-center gap-2'>
                    <button className='p-2 rounded-md cursor-pointer border border-neutral-200'>
                        <Pencil size={18}></Pencil>
                    </button>
                    <button className='p-2 rounded-md cursor-pointer border border-neutral-200'>
                        <Trash size={18}></Trash>
                    </button>
                    <button className='p-2 rounded-md cursor-pointer border border-neutral-200'>
                        <RotateCw size={18}></RotateCw>
                    </button>
                </div>
              </div>
              <div className='flex w-full p-2 rounded-md bg-gray-50 border border-neutral-200 justify-between items-center'>
                <div className='flex flex-col gap-1'>
                    <h1>DARSHIL PATEL</h1>
                    <span className='font-bold'>₹ 12000</span>
                </div>
                <div className='flex items-center gap-2'>
                    <button className='p-2 rounded-md cursor-pointer border border-neutral-200'>
                        <Pencil size={18}></Pencil>
                    </button>
                    <button className='p-2 rounded-md cursor-pointer border border-neutral-200'>
                        <Trash size={18}></Trash>
                    </button>
                    <button className='p-2 rounded-md cursor-pointer border border-neutral-200'>
                        <RotateCw size={18}></RotateCw>
                    </button>
                </div>
              </div>
              <div className='flex w-full p-2 rounded-md bg-gray-50 border border-neutral-200 justify-between items-center'>
                <div className='flex flex-col gap-1'>
                    <h1>DARSHIL PATEL</h1>
                    <span className='font-bold'>₹ 12000</span>
                </div>
                <div className='flex items-center gap-2'>
                    <button className='p-2 rounded-md cursor-pointer border border-neutral-200'>
                        <Pencil size={18}></Pencil>
                    </button>
                    <button className='p-2 rounded-md cursor-pointer border border-neutral-200'>
                        <Trash size={18}></Trash>
                    </button>
                    <button className='p-2 rounded-md cursor-pointer border border-neutral-200'>
                        <RotateCw size={18}></RotateCw>
                    </button>
                </div>
              </div>
              <div className='flex w-full p-2 rounded-md bg-gray-50 border border-neutral-200 justify-between items-center'>
                <div className='flex flex-col gap-1'>
                    <h1>DARSHIL PATEL</h1>
                    <span className='font-bold'>₹ 12000</span>
                </div>
                <div className='flex items-center gap-2'>
                    <button className='p-2 rounded-md cursor-pointer border border-neutral-200'>
                        <Pencil size={18}></Pencil>
                    </button>
                    <button className='p-2 rounded-md cursor-pointer border border-neutral-200'>
                        <Trash size={18}></Trash>
                    </button>
                    <button className='p-2 rounded-md cursor-pointer border border-neutral-200'>
                        <RotateCw size={18}></RotateCw>
                    </button>
                </div>
              </div>
           </div>
           <div className=''></div>
        </div>
    </div>
  )
}

export default Profile