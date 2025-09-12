import React, { useState, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import CustomerForm from '../../components/CustomerForm';

// ✅ AG Grid CSS (core and theme)
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Or any other theme

import { useCustomerTable } from '../../hooks/useCustomerTable';
import Breadcrumb from '../../components/Breadcrumb';

ModuleRegistry.registerModules([AllCommunityModule]);

function CustomerAccount() {
  const [openForm,setOpenForm] = useState(false)
  const [selectedCustomer,setSelectedCustomer] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBranch,setSelectedBranch] = useState('')
  
  const handleOpenForm = (customer=null) =>{
    setSelectedCustomer(customer)
    setOpenForm(true)
  }
  const { loading, rows, columns, refetch} = useCustomerTable(handleOpenForm)

  const handleCloseForm = (refresh) =>{
    setSelectedCustomer(null)
    setOpenForm(false)
    if(refresh) refetch()
  }

  useEffect(()=>{
    refetch(searchQuery, selectedBranch)
  },[searchQuery, selectedBranch])


  return (
    <div className='flex w-full h-full flex-col gap-8'>
      <Breadcrumb selectedBranch={selectedBranch} setSelectedBranch={setSelectedBranch} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onClick={()=>handleOpenForm(null)}></Breadcrumb>
      {openForm && <CustomerForm selectedCustomer={selectedCustomer} onClose={handleCloseForm}></CustomerForm>}
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

export default CustomerAccount