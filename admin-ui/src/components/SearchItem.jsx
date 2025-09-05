import React from 'react'

//Importing icons
import { Building2 } from 'lucide-react';
import { BedSingle } from 'lucide-react';

//Import images
import BOY from '../assets/boy.png'
import WORKER from '../assets/worker.png'
import CHEF from '../assets/chef.png'
import ACMANAGER from '../assets/acmanager.png'
import { sliceString } from '../helper';

function SearchItem({role, item}) {

  const renderComponent = () => {   
       switch(role){
          case 'Customers':
            return (
              <div className='p-2 border border-neutral-300 rounded-lg flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                   <img src={BOY} alt='customer' className='w-8 h-8 rounded-full'></img>
                   <div className='flex flex-col'>
                      <span className='text-sm font-semibold'>{item.customer_name}</span>
                      <span className='text-xs text-gray-500'>{item.mobile_no}</span>
                   </div>
                </div>
                <div className='flex flex-col gap-1 items-end'>
                    <div className='flex items-center gap-4'>
                        <div className='flex items-center'>
                          <Building2 size={16} className='text-gray-600'></Building2>
                          <span className='text-sm text-gray-500 ml-1'>{sliceString(item.branch?.branch_name, 20)}</span>
                        </div>
                    
                        <div className='flex items-center'>
                          <BedSingle size={16} className='text-gray-600'></BedSingle>
                          <span className='text-sm text-gray-500 ml-1'>{item.room?.room_id}</span>
                        </div>
                      </div>

                      <div className='flex items-center gap-1'>
                         <span className='text-sm text-gray-600'>Deposite:</span>
                         <span className='text-gray-500 text-sm'>₹{item?.deposite_amount}</span>
                      </div>
                    
                </div>
              </div>
            )
        
          case 'Employees': 
            return (
              <div className='p-2 border border-neutral-300 rounded-lg flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                   <img src={item.employee_type==="Co-Worker" ? WORKER : CHEF} alt='employee' className='w-8 h-8 rounded-full'></img>
                   <div className='flex flex-col'>
                      <span className='text-sm font-semibold'>{item.employee_name}</span>
                      <span className='text-xs text-gray-500'>{item.mobile_no}</span>
                   </div>
                </div>
                <div className='flex items-center gap-1'>
                    <Building2 size={16} className='text-gray-500'></Building2>
                    <span className='text-sm text-gray-500'>{sliceString(item.branch?.branch_name, 20)}</span>
                </div>
              </div>
            )
        
          case 'Ac Managers':    
            return (
                <div className='p-2 border border-neutral-300 rounded-lg flex items-center justify-between'>
                   <div className='flex items-center gap-2'>
                      <img src={ACMANAGER} alt='acmanager' className='w-8 h-8 rounded-full'></img>
                        <div className='flex flex-col'>
                             <span className='text-sm font-semibold'>{item.full_name}</span>
                             <span className='text-xs text-gray-500'>{item.contact_no}</span>
                        </div>
                   </div>
                   <div className='flex items-center gap-1'>
                    <Building2 size={16} className='text-gray-500'></Building2>
                    <span className='text-sm text-gray-500'>{sliceString(item.branch?.branch_name, 20)}</span>
                </div>
                </div>
            )  

       }
  }  

  return (
    renderComponent()
  )
}

export default SearchItem