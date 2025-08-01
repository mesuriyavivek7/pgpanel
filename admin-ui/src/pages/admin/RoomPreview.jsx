import React, { useEffect, useState } from 'react'
import { AgGridReact } from 'ag-grid-react';
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getRoomById } from '../../services/roomService'
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

import { useCustomerTable } from '../../hooks/useCustomerTable'
import CustomerForm from '../../components/CustomerForm'

// ✅ AG Grid CSS (core and theme)
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Or any other theme

ModuleRegistry.registerModules([AllCommunityModule]);

function RoomPreview() {
  const [room,setRoom] = useState({})
  const [openForm,setOpenForm] = useState(false)
  const [selectedCustomer,setSelectedCustomer] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

  const handleOpenForm = (customer=null) =>{
    setSelectedCustomer(customer)
    setOpenForm(true)
  }

  const { loading, rows, columns, refetch} = useCustomerTable(handleOpenForm, location.state)

  const handleCloseForm = (refresh) =>{
    setSelectedCustomer(null)
    setOpenForm(false)
    if(refresh) refetch()
  }

  useEffect(()=>{
    const handleGetRoomDetails = async () =>{
      try{
        const data = await getRoomById(location.state)
        setRoom(data)
      }catch(err){
        toast.error(err?.message)
      }
    }

    if(location.state) {
      handleGetRoomDetails()
    }else{
      navigate('/')
    }
  },[])

  return (
    <div className='flex w-full h-full flex-col gap-8'>
       {openForm && <CustomerForm selectedCustomer={selectedCustomer} onClose={handleCloseForm}></CustomerForm>}
       <div className='flex items-center gap-2'>
         <span className='cursor-pointer hover:font-medium' onClick={()=>navigate(-1)}>Rooms</span>
         <span>&gt;</span>
         <span>Room {room.room_id}</span>
       </div>
       <div className='w-full h-36 bg-[#edf2f6] rounded-2xl p-4 flex justify-around items-start gap-12'>
          <div className='flex flex-col gap-2'>
             <h1 className='text-2xl font-semibold'>Room {room?.room_id}</h1>
             <span className='text-lg font-medium text-[#36454f]'>{room?.branch?.branch_name}</span>
          </div>
          <div className='flex flex-col flex-1 px-8 gap-2'>
              <div className='grid grid-cols-3 gap-4 items-center'>
                <div className='flex flex-col gap-1 border-r border-neutral-300'>
                    <span className='text-lg font-medium text-[#697282]'>Capacity</span>
                    <h1 className='text-2xl font-bold'>{room?.capacity}</h1>
                </div>
                <div className='flex flex-col gap-1 border-r border-neutral-300'>
                    <span className='text-lg font-medium text-[#697282]'>Occupied</span>
                    <h1 className='text-2xl font-bold'>{room?.filled}</h1>
                </div>
                <div className='flex flex-col gap-1'>
                    <span className='text-lg font-medium text-[#697282]'>Status</span>
                    <h1 className='text-2xl font-bold'>{(room?.capacity === room?.filled ? "Full" : "Available")}</h1>
                </div>
              </div>
          </div>
       </div>
       <div className='h-full ag-theme-alpine w-full'>
       <AgGridReact
       rowData={rows}
       rowHeight={70}
       loading={loading}
       headerHeight={54}
       columnDefs={columns}
       modules={[AllCommunityModule]}
       pagination={true}
       paginationPageSize={10}
       defaultColDef={{
       resizable: true,
       sortable: true,
       // filter: true,
      }}
      />
      </div>
    </div>
  )
}

export default RoomPreview