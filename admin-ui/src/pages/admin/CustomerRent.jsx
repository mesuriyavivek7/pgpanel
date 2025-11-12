import React, { useEffect, useState } from "react";

import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';

import Breadcrumb from "../../components/Breadcrumb";
import { useCustomerRentTable } from "../../hooks/useCustomerRentTable";
import CustomerRentForm from "../../components/CustomerRentForm";


function CustomerRent() {
  const [openForm, setOpenForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");

  const handleOpenForm = (customer = null) => {
    setSelectedCustomer(customer);
    setOpenForm(true);
  };

  const { loading, rows, columns, refetch } =
    useCustomerRentTable(handleOpenForm);


  useEffect(()=>{
    refetch(searchQuery, selectedBranch) 
  },[searchQuery, selectedBranch])  

  const handleCloseForm = (refresh) => {
    setSelectedCustomer(null);
    setOpenForm(false);
    if (refresh) refetch();
  };

  return (
    <div className="flex w-full h-full flex-col gap-8">
      {openForm && <CustomerRentForm selectedCustomer={selectedCustomer} onClose={handleCloseForm}></CustomerRentForm>}
      <Breadcrumb
        selectedBranch={selectedBranch}
        setSelectedBranch={setSelectedBranch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
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
            getRowId={(row) => row.customerId}
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

export default CustomerRent;
