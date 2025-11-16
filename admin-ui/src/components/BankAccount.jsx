import React, { useEffect, useState } from 'react'
import BankAccountForm from './BankAccountForm';
import ConfirmPopUp from './ConfirmPopUp';

//Import icons
import { Pencil } from 'lucide-react';
import { RotateCw, Plus, Trash } from 'lucide-react';
import { toast } from 'react-toastify';
import { deleteBankAccount, getAllBankAccount, resetAllBankAccount, resetBankAccount } from '../services/bankAccountService';
import { convertIntoRupees } from '../helper';

function BankAccount() {
  const [selectedBankAccount,setSelectedBankAccount] = useState(null)  
  const [openForm,setOpenForm] = useState(false)
  const [bankAccounts,setBankAccounts] = useState([]) 
  const [totalBalance,setTotalBalance] = useState()
  const [openResetForm,setOpenResetForm] = useState(false)
  const [openResetAllForm,setOpenResetAllForm] = useState(false)
  const [openDeleteForm,setOpenDeleteForm] = useState(false)

  const handleGetBankAccounts = async () =>{
    try{
        const data = await getAllBankAccount()
        setBankAccounts(data)
        console.log(data)
        setTotalBalance(data.reduce((x,y)=> x+y.current_balance,0))
    }catch(err){
        console.log(err)
        toast.error(err?.message)
    }
  }

  useEffect(()=>{
    handleGetBankAccounts()
  },[])


  //For open and close bank account form popup
  const handleOpenForm = (account = null) =>{
    setOpenForm(true)
    setSelectedBankAccount(account)
  }

  const handleCloseForm = (refresh = false) =>{
    setOpenForm(false)
    if(refresh) handleGetBankAccounts()
  }

  //For close all reset confirm popup
  const handleCloseAllResetConfirm = (refresh = false) =>{  
    setOpenResetAllForm(false)
    if(refresh) handleGetBankAccounts()
  }


  //For open and close reset confirm popup
  const handleOpenResetConfirm = (account = null) =>{
    setOpenResetForm(true)
    setSelectedBankAccount(account)
  }

  const handleCloseResetConfirm = (refresh = false) =>{
     setOpenResetForm(false)
      if(refresh) handleGetBankAccounts()
  }

  //For open and close Delete confirm popup
  const handleOpenDeleteConfirm = (account = null) =>{  
    setOpenDeleteForm(true)
    setSelectedBankAccount(account)
  }

  const handleCloseDeleteConfirm = (refresh = false) =>{  
    setOpenDeleteForm(false)
    if(refresh) handleGetBankAccounts()
  }

  const handleResetAllBankAccounts = async () =>{
      try{
        const data = await resetAllBankAccount()
        handleCloseAllResetConfirm(true)
        toast.success("All bank accounts reset successfully.")
      }catch(err){
        console.log(err)
        toast.error(err?.message)
      }
  }

  const handleResetBankAccount = async (accountId) =>{
     try{
        const data = await resetBankAccount(accountId)
        handleCloseResetConfirm(true)
        toast.success("Bank account reset successfully.")
     }catch(err){
        console.log(err)
        toast.error(err?.message)
     }
  }

  const handleDeleteBankAccount = async (accountId) =>{
    try{
      const data = await deleteBankAccount(accountId)
      handleCloseDeleteConfirm(true)
      toast.success("Bank account deleted successfully.")
    }catch(err){
      console.log(err)
      toast.error(err?.message)
    }
  }

  return (
    <div className='p-3 sm:p-4 md:p-6 border h-full border-neutral-200 bg-white rounded-md flex flex-col gap-3 sm:gap-4'>
          {openResetForm && <ConfirmPopUp buttonText={"Reset"} onAction={()=>handleResetBankAccount(selectedBankAccount._id)} onClose={handleCloseResetConfirm} confirmText={'Are you sure to reset your bank account?'}></ConfirmPopUp>}
          {openResetAllForm && <ConfirmPopUp buttonText={"Reset All"} onAction={handleResetAllBankAccounts} onClose={handleCloseAllResetConfirm} confirmText={'Are you sure to reset all bank accounts?'}></ConfirmPopUp>}
          {openForm && <BankAccountForm onClose={handleCloseForm} selectedBankAccount={selectedBankAccount}></BankAccountForm>}
          {openDeleteForm && <ConfirmPopUp onClose={handleCloseDeleteConfirm} selectedBankAccount={selectedBankAccount} onAction={()=>handleDeleteBankAccount(selectedBankAccount._id)} buttonText={'Delete'} confirmText={'Are you sure to delete your bank account?'}></ConfirmPopUp>}

           <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-2'>
              <h1 className='text-lg sm:text-xl md:text-2xl font-semibold break-words'>Bank Accounts</h1>
              <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto'>
                 <button onClick={()=>setOpenResetAllForm(true)} className='flex cursor-pointer bg-blue-500 hover:bg-blue-600 transition-all duration-300 items-center justify-center gap-2 p-2 sm:p-2.5 rounded-md text-sm sm:text-base'>
                    <RotateCw size={16} className='sm:w-5 sm:h-5 text-white'></RotateCw>
                    <span className='text-white whitespace-nowrap'>Reset All Balances</span>
                 </button>
                 <button onClick={()=>handleOpenForm()} className='flex cursor-pointer bg-blue-500 hover:bg-blue-600 transition-all duration-300 items-center justify-center gap-2 p-2 sm:p-2.5 rounded-md text-sm sm:text-base'>
                    <Plus size={16} className='sm:w-5 sm:h-5 text-white'></Plus>
                    <span className='text-white whitespace-nowrap'>Add Account</span>
                 </button>
              </div>
           </div>
           <div className='overflow-y-auto min-h-[200px] sm:h-64 max-h-[400px] flex flex-col gap-2 sm:gap-3'>
              {
                bankAccounts.map((acc, index) => (
                <div key={index} className='flex flex-col sm:flex-row w-full p-2 sm:p-3 rounded-md bg-gray-50 border border-neutral-200 justify-between items-start sm:items-center gap-2 sm:gap-0'>
                 <div className='flex flex-col gap-1 flex-1 min-w-0'>
                    <div className='flex items-center gap-2'>
                       <h1 className='text-sm sm:text-base font-medium break-words'>{acc.account_holdername}</h1>
                       {acc.is_default && <span className='text-xs sm:text-sm bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium'>Default</span>}
                    </div>
                    <span className='text-sm sm:text-base font-bold'>{convertIntoRupees(acc.current_balance)}</span>
                 </div>
                 <div className='flex items-center gap-1.5 sm:gap-2 flex-shrink-0'>
                    <button onClick={()=>handleOpenForm(acc)} className='p-1.5 sm:p-2 hover:bg-blue-100 hover:text-blue-500 transition-all duration-300 rounded-md cursor-pointer border border-neutral-200' title='Edit'>
                        <Pencil size={16} className="sm:w-5 sm:h-5"></Pencil>
                    </button>
                    <button onClick={()=>handleOpenDeleteConfirm(acc)} className='p-1.5 sm:p-2 hover:bg-red-100 hover:text-red-500 transition-all duration-300 rounded-md cursor-pointer border border-neutral-200' title='Delete'>
                        <Trash size={16} className="sm:w-5 sm:h-5"></Trash>
                    </button>
                    <button onClick={()=>handleOpenResetConfirm(acc)} className='p-1.5 sm:p-2 hover:bg-yellow-100 hover:text-yellow-500 transition-all duration-300 rounded-md cursor-pointer border border-neutral-200' title='Reset'>
                        <RotateCw size={16} className="sm:w-5 sm:h-5"></RotateCw>
                    </button>
                 </div>
                </div>
                ))
              }
           </div>
           <div className='flex items-center justify-between p-2 sm:p-3 bg-gray-100 rounded-md'>
             <span className='text-base sm:text-lg font-medium'>Total Balance</span>
             <span className='text-lg sm:text-xl font-semibold'>{convertIntoRupees(totalBalance)}</span>
           </div>
    </div>
  )
}

export default BankAccount