import React, { useEffect, useState } from 'react'
import BankAccountForm from './BankAccountForm';

//Import icons
import { Pencil } from 'lucide-react';
import { Lock } from 'lucide-react';
import { RotateCw, Plus, Trash } from 'lucide-react';
import { toast } from 'react-toastify';
import { getAllBankAccount } from '../services/bankAccountService';
import { convertIntoRupees } from '../helper';

function BankAccount() {
  const [selectedBankAccount,setSelectedBankAccount] = useState(null)  
  const [openForm,setOpenForm] = useState(false)
  const [bankAccounts,setBankAccounts] = useState([]) 
  const [totalBalance,setTotalBalance] = useState()

  const handleOpenForm = (account = null) =>{
    setOpenForm(true)
    setSelectedBankAccount(account)
  }

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

  const handleCloseForm = (refresh = false) =>{
    setOpenForm(false)
    if(refresh) handleGetBankAccounts()
  }

  console.log(bankAccounts)

  return (
    <div className='p-4 border h-full border-neutral-200 bg-white rounded-md flex flex-col gap-4'>
          {openForm && <BankAccountForm selectedBankAccount={selectedBankAccount} onClose={handleCloseForm}></BankAccountForm>}
           <div className='flex justify-between items-center'>
              <h1 className='text-2xl font-semibold'>Bank Accounts</h1>
              <div className='flex items-center gap-2'>
                 <button className='flex cursor-pointer bg-blue-500 hover:bg-blue-600 transition-all duration-300 items-center gap-2 p-2 rounded-md'>
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
                    <button onClick={()=>handleOpenForm(acc)} className='p-2 rounded-md cursor-pointer border border-neutral-200'>
                        <Pencil size={18}></Pencil>
                    </button>
                    <button className='p-2 rounded-md cursor-pointer border border-neutral-200'>
                        <Trash size={18}></Trash>
                    </button>
                    <button className='p-2 rounded-md cursor-pointer border border-neutral-200'>
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