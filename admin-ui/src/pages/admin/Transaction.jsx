import React, {useEffect, useState} from 'react'
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

// ✅ AG Grid CSS (core and theme)
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Or any other theme

import Breadcrumb from '../../components/Breadcrumb';
import { useTransactionTable } from '../../hooks/useTransactionTable';

ModuleRegistry.registerModules([AllCommunityModule]);

function Transaction() {
  const [selectedBranch,setSelectedBranch] = useState("")
  const [selectedTransactions,setSelectedTransactions] = useState("")

  const {rows, columns, loading, refetch} = useTransactionTable() 

  console.log(selectedBranch)
  console.log(selectedTransactions)

  useEffect(()=>{
     refetch(selectedBranch, selectedTransactions)
  },[selectedBranch,selectedTransactions])
  return (
    <div className='w-full h-full flex flex-col gap-8'>
        <Breadcrumb
         selectedBranch={selectedBranch}
         setSelectedBranch={setSelectedBranch}
         selectedTransactions={selectedTransactions}
         setSelectedTransactions={setSelectedTransactions}
        ></Breadcrumb>
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

export default Transaction