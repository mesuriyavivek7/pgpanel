import React, {useEffect, useState} from 'react'

import Breadcrumb from '../../components/Breadcrumb';
import { useCashoutTable } from '../../hooks/useCashoutTable';
import CashoutForm from '../../components/CashoutForm';

import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';

function CashOut() {
  const [openForm, setOpenForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  console.log(searchQuery)

  const {rows , columns , loading , refetch } = useCashoutTable()

  useEffect(()=>{
     refetch(searchQuery)
  },[searchQuery])

  const handleOpenForm = () =>{
    setOpenForm(true)
  }

  const handleCloseForm = (refresh = false) =>{
   setOpenForm(false)
   if(refresh) refetch()
  }


  return (
    <div className='flex w-full h-full flex-col gap-8'>
      {openForm && <CashoutForm onClose={handleCloseForm}></CashoutForm>}
      <Breadcrumb
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      onClick={handleOpenForm}
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

export default CashOut