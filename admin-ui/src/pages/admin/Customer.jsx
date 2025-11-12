import React, { useState, useEffect } from 'react'
import CustomerForm from '../../components/CustomerForm';
import DepositeForm from '../../components/DepositeForm';
import CustomerAdvanceRentForm from '../../components/CustomerAdvanceRentForm';

import { useCustomerTable } from '../../hooks/useCustomerTable';
import Breadcrumb from '../../components/Breadcrumb';

import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';

function Customer() {
  const [openForm,setOpenForm] = useState(false)
  const [selectedCustomer,setSelectedCustomer] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBranch,setSelectedBranch] = useState('')
  const [openDepositeForm,setOpenDepositeForm] = useState(false)
  const [openAdvanceRentForm,setOpenAdvanceRentForm] = useState(false)
  const [openAdvanceBookingForm,setOpenAdvanceBookingForm] = useState(false)
  
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
  

  const { loading, rows, columns, refetch} = useCustomerTable(handleOpenForm, "" , handleOpenDepositeForm, handleOpenAdvanceRentForm, handleOpenAdvanceBookingForm)

  const handleCloseForm = (refresh) =>{
    setSelectedCustomer(null)
    setOpenForm(false)
    if(refresh) refetch()
  }

  const handleCloseDepositeForm = (refresh = false) =>{
    setSelectedCustomer(null)
    setOpenDepositeForm(false)
    if(refresh) refetch()
  }

  const handleCloseAdvanceRentForm = (refresh = false) =>{
    setOpenAdvanceRentForm(false)
    setSelectedCustomer(null)
    if(refresh) refetch()
  }

  const handleCloseAdvanceBookingForm = (refresh = false) =>{
    setOpenAdvanceBookingForm(false)
    setSelectedCustomer(null)
    if(refresh) refetch()
  }

  useEffect(()=>{
    refetch(searchQuery, selectedBranch)
  },[searchQuery, selectedBranch])


  return (
    <div className='flex w-full h-full flex-col gap-4 sm:gap-6 md:gap-8 px-2 sm:px-4 md:px-0'>
      <Breadcrumb selectedBranch={selectedBranch} setSelectedBranch={setSelectedBranch} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onClick={()=>handleOpenForm(null)}></Breadcrumb>
      {openForm && <CustomerForm selectedCustomer={selectedCustomer} onClose={handleCloseForm}></CustomerForm>}
      {openAdvanceBookingForm && <CustomerForm isAdvance={true} selectedCustomer={selectedCustomer} onClose={handleCloseAdvanceBookingForm}></CustomerForm>}
      <DepositeForm openForm={openDepositeForm} customer={selectedCustomer} onClose={handleCloseDepositeForm}></DepositeForm>
      <CustomerAdvanceRentForm openForm={openAdvanceRentForm} customer={selectedCustomer} onClose={handleCloseAdvanceRentForm}></CustomerAdvanceRentForm>
      
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

export default Customer