import React, { useEffect, useState } from "react";

import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";

import MonthlyBillForm from "../../components/MonthlyBillForm";
import ConfirmationBox from "../../components/ConfirmationBox";
import MonthlyBillPay from "../../components/MonthlyBillPay";
// ✅ AG Grid CSS (core and theme)
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css"; // Or any other theme

import Breadcrumb from "../../components/Breadcrumb";
import { useMonthlyBillTable } from "../../hooks/useMonthlyBillTable";

ModuleRegistry.registerModules([AllCommunityModule]);

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

export default MonthlyBill