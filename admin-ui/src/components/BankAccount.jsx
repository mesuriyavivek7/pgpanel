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
    <div className='p-4 border h-full border-neutral-200 bg-white rounded-md flex flex-col gap-4'>
          {openResetForm && <ConfirmPopUp buttonText={"Reset"} onAction={()=>handleResetBankAccount(selectedBankAccount._id)} onClose={handleCloseResetConfirm} confirmText={'Are you sure to reset your bank account?'}></ConfirmPopUp>}
          {openResetAllForm && <ConfirmPopUp buttonText={"Reset All"} onAction={handleResetAllBankAccounts} onClose={handleCloseAllResetConfirm} confirmText={'Are you sure to reset all bank accounts?'}></ConfirmPopUp>}
          {openForm && <BankAccountForm onClose={handleCloseForm} selectedBankAccount={selectedBankAccount}></BankAccountForm>}
          {openDeleteForm && <ConfirmPopUp onClose={handleCloseDeleteConfirm} selectedBankAccount={selectedBankAccount} onAction={()=>handleDeleteBankAccount(selectedBankAccount._id)} buttonText={'Delete'} confirmText={'Are you sure to delete your bank account?'}></ConfirmPopUp>}

           <div className='flex justify-between items-center'>
              <h1 className='text-2xl font-semibold'>Bank Accounts</h1>
              <div className='flex items-center gap-2'>
                 <button onClick={()=>setOpenResetAllForm(true)} className='flex cursor-pointer bg-blue-500 hover:bg-blue-600 transition-all duration-300 items-center gap-2 p-2 rounded-md'>
                    <RotateCw size={18} className='text-white'></RotateCw>
                    <span className='text-white'>Reset All Balances</span>
                 </button>
                 <button onClick={()=>handleOpenForm()} className='flex cursor-pointer bg-blue-500 hover:bg-blue-600 transition-all duration-300 items-center gap-2 p-2 rounded-md'>
                    <Plus size={18} className='text-white'></Plus>
                    <span className='text-white'>Add Account</span>
                 </button>
              </div>
           </div>
           <div className='overflow-scroll h-64 flex flex-col gap-2'>
              {
                bankAccounts.map((acc, index) => (
                <div key={index} className='flex w-full p-2 rounded-md bg-gray-50 border border-neutral-200 justify-between items-center'>
                 <div className='flex flex-col gap-1'>
                    <h1>{acc.account_holdername}</h1>
                    <span className='font-bold'>{convertIntoRupees(acc.current_balance)}</span>
                 </div>
                 <div className='flex items-center gap-2'>
                    <button onClick={()=>handleOpenForm(acc)} className='p-2 hover:bg-blue-100 hover:text-blue-500 transition-all duration-300 rounded-md cursor-pointer border border-neutral-200'>
                        <Pencil size={18}></Pencil>
                    </button>
                    <button onClick={()=>handleOpenDeleteConfirm(acc)} className='p-2 hover:bg-red-100 hover:text-red-500 transition-all duration-300 rounded-md cursor-pointer border border-neutral-200'>
                        <Trash size={18}></Trash>
                    </button>
                    <button onClick={()=>handleOpenResetConfirm(acc)} className='p-2 hover:bg-yellow-100 hover:text-yellow-500 transition-all duration-300 rounded-md cursor-pointer border border-neutral-200'>
                        <RotateCw size={18}></RotateCw>
                    </button>
                 </div>
                </div>
                ))
              }
           </div>
           <div className='flex items-center justify-between p-2 bg-gray-100 rounded-md'>
             <span className='text-lg font-medium'>Total Balance</span>
             <span className='text-xl font-semibold'>{convertIntoRupees(totalBalance)}</span>
           </div>
    </div>
  )
}

export default BankAccount