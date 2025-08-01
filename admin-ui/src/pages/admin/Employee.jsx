import React, { useEffect, useState } from 'react'
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

// ✅ AG Grid CSS (core and theme)
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Or any other theme

import EmployeeForm from '../../components/EmployeeForm';
import { useEmployeeTable } from '../../hooks/useEmployeeTable';
import Breadcrumb from '../../components/Breadcrumb';

ModuleRegistry.registerModules([AllCommunityModule]);


function Employee() {
  const [openForm, setOpenForm] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBranch, setSelectedBranch] = useState('')

  const handleOpenForm = (employee = null) =>{
    setSelectedEmployee(employee)
    setOpenForm(true)
  }

  const {loading, rows, columns, refetch} = useEmployeeTable(handleOpenForm)

  const handleCloseForm = (refresh=false) => {
    setSelectedEmployee(null)
    setOpenForm(false)
    if(refresh) refetch(searchQuery)
  }

  useEffect(()=>{
     refetch(searchQuery, selectedBranch)
  },[searchQuery, selectedBranch])

  return (
    <div className='flex w-full h-full flex-col gap-8'>
      {openForm && <EmployeeForm selectedEmployee={selectedEmployee} onClose={handleCloseForm}></EmployeeForm>}
      <Breadcrumb selectedBranch={selectedBranch} setSelectedBranch={setSelectedBranch} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onClick={()=>handleOpenForm(null)}></Breadcrumb>

      <div className='h-full ag-theme-alpine w-full'>
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

export default Employee