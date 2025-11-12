import React, { useEffect, useState } from 'react'


import EmployeeForm from '../../components/EmployeeForm';
import { useEmployeeTable } from '../../hooks/useEmployeeTable';
import Breadcrumb from '../../components/Breadcrumb';
import EmployeeAdvanceSalary from '../../components/EmployeeAdvanceSalary';

import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';

function Employee() {
  const [openForm, setOpenForm] = useState(false)
  const [openAdvanceSalaryForm, setOpenAdvanceSalaryForm] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBranch, setSelectedBranch] = useState('')

  const handleOpenForm = (employee = null) =>{
    setSelectedEmployee(employee)
    setOpenForm(true)
  }

  const handleOpenAdvanceRentForm = (employee=null) => {
    setOpenAdvanceSalaryForm(true)
    setSelectedEmployee(employee)
  }

  const {loading, rows, columns, refetch} = useEmployeeTable(handleOpenForm, handleOpenAdvanceRentForm)

  const handleCloseForm = (refresh=false) => {
    setSelectedEmployee(null)
    setOpenForm(false)
    if(refresh) refetch(searchQuery)
  }

  const handleCloseAdvanceSalaryForm = (refresh = false) => {
    setOpenAdvanceSalaryForm(false)
    setSelectedEmployee(null)
    if(refresh) refetch(searchQuery)
  }

  useEffect(()=>{
     refetch(searchQuery, selectedBranch)
  },[searchQuery, selectedBranch])

  return (
    <div className='flex w-full h-full flex-col gap-8'>
      {openForm && <EmployeeForm selectedEmployee={selectedEmployee} onClose={handleCloseForm}></EmployeeForm>}
      <Breadcrumb selectedBranch={selectedBranch} setSelectedBranch={setSelectedBranch} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onClick={()=>handleOpenForm(null)}></Breadcrumb>
      <EmployeeAdvanceSalary openForm={openAdvanceSalaryForm} onClose={handleCloseAdvanceSalaryForm} employee={selectedEmployee}></EmployeeAdvanceSalary>

      <div className='h-full ag-theme-alpine w-full'>
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
  )
}

export default Employee