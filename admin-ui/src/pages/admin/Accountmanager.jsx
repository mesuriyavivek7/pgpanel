import React, { useEffect, useState } from "react";

import { useAccountTable } from "../../hooks/useAccountTable";
import Breadcrumb from "../../components/Breadcrumb";
import AccountForm from "../../components/AccountForm";


import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';


function Accountmanager() {
  const [openForm, setOpenForm] = useState(false);
  const [selectedAcmanager, setSelectedAcmanager] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch,setSelectedBranch] = useState('')

  const handleOpenForm = (acmanager = null) => {
    setSelectedAcmanager(acmanager);
    setOpenForm(true);
  };

  const { rows, loading, columns, refetch } = useAccountTable(handleOpenForm);

  const handleCloseForm = (refresh = false) => {
    setSelectedAcmanager(null);
    setOpenForm(false);
    if (refresh) refetch();
  };

  useEffect(()=>{
    refetch(searchQuery, selectedBranch)
  }, [searchQuery, selectedBranch])

  return (
    <div className="flex w-full h-full flex-col gap-8">
      {openForm && <AccountForm selectedAccount={selectedAcmanager} onClose={handleCloseForm}></AccountForm>}
      <Breadcrumb
        selectedBranch={selectedBranch}
        setSelectedBranch={setSelectedBranch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onClick={() => handleOpenForm(null)}
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
  );
}

export default Accountmanager;
