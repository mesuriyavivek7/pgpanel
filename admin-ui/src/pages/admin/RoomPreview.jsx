import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getRoomById } from '../../services/roomService'
import { useCustomerTable } from '../../hooks/useCustomerTable'
import CustomerForm from '../../components/CustomerForm'
import DepositeForm from '../../components/DepositeForm';
import CustomerAdvanceRentForm from '../../components/CustomerAdvanceRentForm';
import { deleteCustomer } from '../../services/customerService'
import ConfirmPopUp from '../../components/ConfirmPopUp'

import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';


function RoomPreview() {
  const [loader, setLoader] = useState(false)
  const [room,setRoom] = useState({})
  const [openForm,setOpenForm] = useState(false)
  const [selectedCustomer,setSelectedCustomer] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()
  const [openDepositeForm,setOpenDepositeForm] = useState(false)
  const [openAdvanceRentForm,setOpenAdvanceRentForm] = useState(false)
  const [openAdvanceBookingForm,setOpenAdvanceBookingForm] = useState(false)
  const [openConfirmation,setOpenConfirmation] = useState(false)

  const handleOpenForm = (customer=null) =>{
    setSelectedCustomer(customer)
    setOpenForm(true)
  }

  const handleOpenDepositeForm = (data) => {
    setSelectedCustomer(data)
    setOpenDepositeForm(true)
  }

  const handleOpenAdvanceRentForm = (data) => {
    setOpenAdvanceRentForm(true)
    setSelectedCustomer(data)
  }

  const handleOpenAdvanceBookingForm = (data) => {
    setSelectedCustomer(data)
    setOpenAdvanceBookingForm(true)
    setSelectedCustomer(data)
  }

  const handleOpenConfirmBox = (data) =>{
    setSelectedCustomer(data)
    setOpenConfirmation(true)
  }

  const { loading, rows, columns, refetch} = useCustomerTable(handleOpenForm, location.state, handleOpenDepositeForm, handleOpenAdvanceRentForm, handleOpenAdvanceBookingForm, handleOpenConfirmBox)

  const handleCloseForm = (refresh) =>{
    setSelectedCustomer(null)
    setOpenForm(false)
    if(refresh) refetch("", "", location.state)
  }

  const handleCloseDepositeForm = (refresh = false) =>{
    setSelectedCustomer(null)
    setOpenDepositeForm(false)
    if(refresh) refetch("", "", location.state)
  }

  const handleCloseAdvanceRentForm = (refresh = false) =>{
    setOpenAdvanceRentForm(false)
    setSelectedCustomer(null)
    if(refresh) refetch("", "", location.state)
  }

  const handleCloseAdvanceBookingForm = (refresh = false) =>{
    setOpenAdvanceBookingForm(false)
    setSelectedCustomer(null)
    if(refresh) refetch("", "", location.state)
  }

  const handleCloseConfirmBox = (refresh = false) =>{
    setSelectedCustomer(null)
    setOpenConfirmation(false)
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

  const handleDeleteCustomer = async () =>{
    setLoader(true)
    try{
      const data = await deleteCustomer(selectedCustomer._id)
      toast.success("Customer is deleted successfully.")
      handleCloseConfirmBox()
      refetch()
    }catch(err){
      console.log(err?.message)
      toast.error(err?.message)
    }finally{
     setLoader(false)
    }
  }

  return (
    <div className='flex w-full h-full flex-col gap-4 sm:gap-6 md:gap-8 px-2 sm:px-4 md:px-0'>
       {openForm && <CustomerForm selectedCustomer={selectedCustomer} onClose={handleCloseForm}></CustomerForm>}
       {openAdvanceBookingForm && <CustomerForm isAdvance={true} selectedCustomer={selectedCustomer} onClose={handleCloseAdvanceBookingForm}></CustomerForm>}
       {openConfirmation && <ConfirmPopUp loading={loader} onClose={handleCloseConfirmBox} onAction={handleDeleteCustomer} buttonText={"Delete"} confirmText={"Are you sure to want to delete this customer?"}></ConfirmPopUp>}
      <DepositeForm openForm={openDepositeForm} customer={selectedCustomer} onClose={handleCloseDepositeForm}></DepositeForm>
      <CustomerAdvanceRentForm openForm={openAdvanceRentForm} customer={selectedCustomer} onClose={handleCloseAdvanceRentForm}></CustomerAdvanceRentForm>
       <div className='flex items-center gap-1 sm:gap-2 text-sm sm:text-base'>
         <span className='cursor-pointer hover:font-medium' onClick={()=>navigate(-1)}>Rooms</span>
         <span>&gt;</span>
         <span>Room {room.room_id}</span>
       </div>
       <div className='w-full min-h-32 sm:h-36 bg-[#edf2f6] rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 flex flex-col sm:flex-row sm:justify-around sm:items-start gap-4 sm:gap-6 md:gap-12'>
          <div className='flex flex-col gap-1 sm:gap-2'>
             <h1 className='text-xl sm:text-2xl md:text-3xl font-semibold'>Room {room?.room_id}</h1>
             <span className='text-sm sm:text-base md:text-lg font-medium text-[#36454f]'>{room?.branch?.branch_name}</span>
          </div>
          <div className='flex flex-col flex-1 sm:px-4 md:px-8 gap-2 sm:gap-3'>
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 items-center'>
                <div className='flex flex-col gap-1 border-r-0 sm:border-r border-neutral-300 pb-2 sm:pb-0 border-b sm:border-b-0'>
                    <span className='text-sm sm:text-base md:text-lg font-medium text-[#697282]'>Capacity</span>
                    <h1 className='text-xl sm:text-2xl md:text-3xl font-bold'>{room?.capacity}</h1>
                </div>
                <div className='flex flex-col gap-1 border-r-0 sm:border-r border-neutral-300 pb-2 sm:pb-0 border-b sm:border-b-0'>
                    <span className='text-sm sm:text-base md:text-lg font-medium text-[#697282]'>Occupied</span>
                    <h1 className='text-xl sm:text-2xl md:text-3xl font-bold'>{room?.filled}</h1>
                </div>
                <div className='flex flex-col gap-1'>
                    <span className='text-sm sm:text-base md:text-lg font-medium text-[#697282]'>Status</span>
                    <h1 className='text-xl sm:text-2xl md:text-3xl font-bold'>{(room?.capacity === room?.filled ? "Full" : "Available")}</h1>
                </div>
              </div>
          </div>
       </div>
       <div className='h-full ag-theme-alpine w-full overflow-x-auto'>
       <Box 
            sx={{
             height: "100%",
             minHeight: "400px",
             "& .MuiDataGrid-root": {
            border: "none", 
            borderRadius: "12px",
            overflow: "hidden",
            },
            "& .MuiDataGrid-columnHeaders": {
               backgroundColor: "#edf3fd",
               fontWeight: "bold",  
               fontSize: { xs: "0.75rem", sm: "0.9rem" }
             },
            "& .MuiDataGrid-cell": {
               fontSize: { xs: "0.75rem", sm: "0.875rem" },
               whiteSpace: "normal",
               wordBreak: "break-word",
             },
            "& .MuiDataGrid-footerContainer": {
               fontSize: { xs: "0.75rem", sm: "0.875rem" }
             }
            }}>
           <DataGrid
            rows={rows}
            columns={columns}
            rowHeight={65}
            loading={loading}
            initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
           }}
           pageSizeOptions={[3, 5, 10]}
           disableRowSelectionOnClick
          />
         </Box>
      </div>
    </div>
  )
}

export default RoomPreview