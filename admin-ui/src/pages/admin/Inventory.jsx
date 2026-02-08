import React, { useEffect, useState } from "react";

import InventoryForm from "../../components/InventoryForm";
import Breadcrumb from "../../components/Breadcrumb";
import { useInventoryTable } from "../../hooks/useInventoryTable";

import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';

function Inventory() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBranch,setSelectedBranch] = useState('')
  const [openForm,setOpenForm] = useState(false)
  const [selectedInventory, setSelectedInventory] = useState(null)

  const handleOpenForm = (inventory = null) =>{
    setSelectedInventory(inventory)
    setOpenForm(true)
  }

  const {rows, columns, loading, refetch} = useInventoryTable(handleOpenForm)

  useEffect(()=>{
    refetch(searchQuery, selectedBranch)
  },[searchQuery, selectedBranch])

  const handleCloseForm = (refresh = false) =>{
    setSelectedInventory(null)
    setOpenForm(false)
    if(refresh) refetch()
  }

  return (
    <div className="flex w-full h-full flex-col gap-8">
      {openForm && <InventoryForm selectedInventory={selectedInventory} onClose={handleCloseForm}></InventoryForm>}
      <Breadcrumb
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      selectedBranch={selectedBranch}
      setSelectedBranch={setSelectedBranch}
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
            getRowId={(row) => row._id}
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

export default Inventory