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
    <div className='flex flex-col h-full gap-8'>
        {openForm && <AddNewBranch selectedBranch={selectedBranch} onClose={handleCloseForm}></AddNewBranch>}
        <Breadcrumb searchQuery={searchQuery} setSearchQuery={setSearchQuery} onClick={handleOpenForm}></Breadcrumb>
        {
          loading ? 
          <div className='flex h-full w-full justify-center items-center'>
             <LoaderCircle size={30} className='text-blue-500 animate-spin'></LoaderCircle>
          </div>
          :branch.length === 0 ? 
          <div className='flex h-full w-full justify-center items-center'>
            <div className='flex flex-col items-center gap-2'>
               <Building2 className='text-gray-500' size={36}></Building2>
               <span className='text-gray-500'>No Branch Found.</span>
            </div>
          </div>
          :<div className='grid grid-cols-1 md:grid-cols-3 items-stretch gap-8'>
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