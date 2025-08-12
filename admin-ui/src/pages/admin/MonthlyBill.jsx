import React, { useState } from "react";

import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";

// ✅ AG Grid CSS (core and theme)
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css"; // Or any other theme

import Breadcrumb from "../../components/Breadcrumb";
import { useMonthlyBillTable } from "../../hooks/useMonthlyBillTable";

ModuleRegistry.registerModules([AllCommunityModule]);

function MonthlyBill() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBranch,setSelectedBranch] = useState(null)
  const [openForm,setOpenForm] = useState(false)
  const [selectedMonthlyBill, setSelectedMonthlyBill] = useState(null)

  const handleOpenForm = (monthlyBill = null) =>{
    setSelectedMonthlyBill(monthlyBill)
    setOpenForm(true)
  }

  const {rows, loading, columns, refetch} = useMonthlyBillTable()

  const handleCloseForm = (refresh = false) =>{
    setOpenForm(false)
    setSelectedMonthlyBill(null)
    if(refresh) refetch()
  }

  return (
    <div className="flex w-full h-full flex-col gap-8">
      <Breadcrumb
      searchQuery={searchQuery}
      setSelectedBranch={setSelectedBranch}
      setSearchQuery={setSearchQuery}
      selectedBranch={selectedBranch}
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