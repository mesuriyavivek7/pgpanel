import React, { useEffect, useState } from 'react'
import Breadcrumb from '../../components/Breadcrumb'
import { toast } from 'react-toastify'
import { getAllBranch } from '../../services/branchService'
import AddNewBranch from '../../components/BranchForm'

//Importing icons
import { LoaderCircle } from 'lucide-react'
import { Building2 } from 'lucide-react';
import BranchCard from '../../components/BranchCard'


function Branch() {
  const [branch,setBranch] = useState([])
  const [loading,setLoading] = useState(false)
  const [searchQuery,setSearchQuery] = useState('')
  const [openForm,setOpenForm] = useState(false)
  const [selectedBranch,setSelectedBranch] = useState(null)

  const handleGetAllBranch = async () =>{
    setLoading(true)
    try{
      const data = await getAllBranch(searchQuery)
      setBranch(data)
    }catch(err){
      toast.error(err?.message)
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    handleGetAllBranch()
  },[searchQuery])

  const handleOpenForm = (branch = null) =>{
     setSelectedBranch(branch)
     setOpenForm(true)
  }

  const handleCloseForm = (refresh = false) =>{
    setSelectedBranch(null)
    setOpenForm(false)
    if(refresh) handleGetAllBranch()
   
  }

  return (
    <div className='flex flex-col h-full gap-4 sm:gap-6 md:gap-8 px-2 sm:px-0'>
        {openForm && <AddNewBranch selectedBranch={selectedBranch} onClose={handleCloseForm}></AddNewBranch>}
        <Breadcrumb searchQuery={searchQuery} setSearchQuery={setSearchQuery} onClick={handleOpenForm}></Breadcrumb>
        {
          loading ? 
          <div className='flex h-full w-full justify-center items-center min-h-[200px] sm:min-h-[300px]'>
             <LoaderCircle className='w-6 h-6 sm:w-8 sm:h-8 text-blue-500 animate-spin'></LoaderCircle>
          </div>
          :branch.length === 0 ? 
          <div className='flex h-full w-full justify-center items-center min-h-[200px] sm:min-h-[300px]'>
            <div className='flex flex-col items-center gap-2 sm:gap-3'>
               <Building2 className='text-gray-500 w-8 h-8 sm:w-9 sm:h-9'></Building2>
               <span className='text-gray-500 text-sm sm:text-base'>No Branch Found.</span>
            </div>
          </div>
          :<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-stretch gap-4 sm:gap-6 md:gap-8'>
            {
              branch.map((item, index) => (
                <BranchCard openForm={handleOpenForm} key={index} item={item}></BranchCard>
              ))
            }
          </div>
        }
    </div>
  )
}

export default Branch