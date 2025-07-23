import React from 'react'
import Breadcrumb from '../../components/Breadcrumb'
import Chart from '../../components/Chart'

function AdminDashboard() {
  return (
    <div className='flex flex-col gap-8'>
      <Breadcrumb></Breadcrumb>

      {/* State Card */}
      <div className='grid grid-cols-4 gap-4'>
        <div className='p-4 bg-white border border-neutral-300 rounded-md flex items-center'>
           <div className='flex flex-col gap-4'>
             <span className='text-[#7E7E85]'>Total Branches</span>
             <h1 className='text-4xl font-semibold'>7</h1>
           </div>
        </div>
        <div className='p-4 bg-white border border-neutral-300 rounded-md flex items-center'>
           <div className='flex flex-col gap-4'>
             <span className='text-[#7E7E85]'>Total Customer</span>
             <h1 className='text-4xl font-semibold'>7</h1>
           </div>
        </div>
        <div className='p-4 bg-white border border-neutral-300 rounded-md flex items-center'>
           <div className='flex flex-col gap-4'>
             <span className='text-[#7E7E85]'>Total Employees</span>
             <h1 className='text-4xl font-semibold'>7</h1>
           </div>
        </div>
        <div className='p-4 bg-white border border-neutral-300 rounded-md flex items-center'>
           <div className='flex flex-col gap-4'>
             <span className='text-[#7E7E85]'>Total Account Manager</span>
             <h1 className='text-4xl font-semibold'>7</h1>
           </div>
        </div>
      </div>

    {/* Analytic */}
    <div className='flex flex-col gap-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-semibold'>Analytics</h1>
      </div>
      <div className='grid grid-cols-2 items-stretch gap-4'>
        <Chart></Chart>
        <Chart></Chart>
      </div>
    </div>

    </div>
  )
}

export default AdminDashboard