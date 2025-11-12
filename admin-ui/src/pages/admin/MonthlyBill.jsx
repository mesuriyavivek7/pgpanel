import React, { useEffect, useState } from "react";

import MonthlyBillForm from "../../components/MonthlyBillForm";
import ConfirmationBox from "../../components/ConfirmationBox";
import MonthlyBillPay from "../../components/MonthlyBillPay";

import Breadcrumb from "../../components/Breadcrumb";
import { useMonthlyBillTable } from "../../hooks/useMonthlyBillTable";

import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';

function MonthlyBill() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBranch,setSelectedBranch] = useState('')
  const [openForm,setOpenForm] = useState(false)
  const [openConfirmBox,setOpenConfirmBox] = useState(false)
  const [openPayForm,setOpenPayForm] = useState(false)
  const [selectedMonthlyBill, setSelectedMonthlyBill] = useState(null)

  const handleOpenForm = (monthlyBill = null) =>{
    setSelectedMonthlyBill(monthlyBill)
    setOpenForm(true)
  }

  const handleOpenConfirmationBox = (monthlyBill = null) =>{
    setOpenConfirmBox(true)
    setSelectedMonthlyBill(monthlyBill)
  }

  const handleOpenPayForm = (monthlyBill = null) =>{
    setOpenPayForm(true)
    setSelectedMonthlyBill(monthlyBill)
  }

  const {rows, loading, columns, refetch} = useMonthlyBillTable(handleOpenForm, handleOpenConfirmationBox, handleOpenPayForm)

  const handleCloseForm = (refresh = false) =>{
    setOpenForm(false)
    setSelectedMonthlyBill(null)
    if(refresh) refetch()
  }

  const handleCloseConfirmationBox = (refresh = false) =>{
    setOpenConfirmBox(false)
    setSelectedMonthlyBill(null)
    if(refresh) refetch()
  }

  const handleClosePayForm = (refresh = false) =>{
    setOpenPayForm(false)
    setSelectedMonthlyBill(null)
    if(refresh) refetch()
  }

  useEffect(()=>{
    refetch(searchQuery, selectedBranch)
  },[searchQuery, selectedBranch])

  return (
    <div className="flex w-full h-full flex-col gap-8">
      {openForm && <MonthlyBillForm monthlyBill={selectedMonthlyBill} onClose={handleCloseForm}></MonthlyBillForm>}
      {openConfirmBox && <ConfirmationBox monthlyBill={selectedMonthlyBill} onClose={handleCloseConfirmationBox}></ConfirmationBox>}
      {openPayForm && <MonthlyBillPay monthlyBill={selectedMonthlyBill} onClose={handleClosePayForm}></MonthlyBillPay>}
      <Breadcrumb
      searchQuery={searchQuery}
      setSelectedBranch={setSelectedBranch}
      setSearchQuery={setSearchQuery}
      selectedBranch={selectedBranch}
      onClick={handleOpenForm}
      ></Breadcrumb>
      <div className="h-full ag-theme-alpine w-full">
      <Box 
            sx={{
             height: "100%",
             "& .MuiDataGrid-root": {
            border: "none", 
            borderRadius: "12px",
            overflow: "hidden",
            },
            "& .MuiDataGrid-columnHeaders": {
               backgroundColor: "#edf3fd",  // Header background color
               fontWeight: "bold",  
               fontSize:'.9rem'
             },    
            }}>
           <DataGrid
            getRowId={(row) => row.billId}
            rows={rows}
            columns={columns}
            rowHeight={70}
            loading={loading}
            initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
           }}
           pageSizeOptions={[5,10]}
           disableRowSelectionOnClick
          />
         </Box>
      </div>
    </div>
  )
}

export default MonthlyBill