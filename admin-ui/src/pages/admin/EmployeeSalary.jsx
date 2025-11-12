import React, { useEffect, useState } from "react";

import Breadcrumb from "../../components/Breadcrumb";
import { useEmployeeSalaryTable } from "../../hooks/useEmployeeSalaryTable";
import EmployeeSalaryForm from "../../components/EmployeeSalaryForm";

import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';

function EmployeeSalary() {
  const [openForm,setOpenForm] = useState(false)
  const [selectedEmployee,setSelectedEmployee] = useState(null) 
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBranch, setSelectedBranch] = useState("");
  
  const handleOpenForm = (employee = null) => {
    setSelectedEmployee(employee);
    setOpenForm(true);
  };

  const { loading, rows, columns, refetch } =
    useEmployeeSalaryTable(handleOpenForm);


  useEffect(()=>{
      refetch(searchQuery, selectedBranch)
  },[searchQuery,selectedBranch])  


  const handleCloseForm = (refresh) => {
    setSelectedEmployee(null);
    setOpenForm(false);
    if (refresh) refetch();
  };
  
  return (
    <div className="flex w-full h-full flex-col gap-8">
        {openForm && <EmployeeSalaryForm employee={selectedEmployee} onClose={handleCloseForm}></EmployeeSalaryForm>}
        <Breadcrumb
        onClick={handleOpenForm}
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
            getRowId={(row) => row.employeeId}
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

export default EmployeeSalary