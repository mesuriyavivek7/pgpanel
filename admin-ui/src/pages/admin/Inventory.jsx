import React, { useState } from "react";

import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import InventoryForm from "../../components/InventoryForm";

// ✅ AG Grid CSS (core and theme)
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css"; // Or any other theme

import Breadcrumb from "../../components/Breadcrumb";
import { useInventoryTable } from "../../hooks/useInventoryTable";

ModuleRegistry.registerModules([AllCommunityModule]);

function Inventory() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBranch,setSelectedBranch] = useState(null)
  const [openForm,setOpenForm] = useState(false)

  const {rows, columns, loading, refetch} = useInventoryTable()

  const handleOpenForm = () =>{
    setOpenForm(true)
  }

  const handleCloseForm = (refresh = false) =>{
    setOpenForm(false)
    if(refresh) refetch()
  }

  return (
    <div className="flex w-full h-full flex-col gap-8">
      {openForm && <InventoryForm onClose={handleCloseForm}></InventoryForm>}
      <Breadcrumb
      searchQuery={searchQuery}
      setSearchQuery={searchQuery}
      selectedBranch={selectedBranch}
      setSelectedBranch={setSelectedBranch}
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

export default Inventory