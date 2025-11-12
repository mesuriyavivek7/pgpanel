import React, {useEffect, useState} from 'react'


import Breadcrumb from '../../components/Breadcrumb';
import { useTransactionTable } from '../../hooks/useTransactionTable';

import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';

function Transaction() {
  const [selectedBranch,setSelectedBranch] = useState("")
  const [selectedTransactions,setSelectedTransactions] = useState("")

  const {rows, columns, loading, refetch} = useTransactionTable() 

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
            getRowId={(row) => row._id}
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

export default Transaction