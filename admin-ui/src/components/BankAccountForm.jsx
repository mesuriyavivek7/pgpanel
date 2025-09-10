import React, {useEffect, useState} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { bankAccountSchema } from "../validations/bankAccountSchema";
import { useForm } from "react-hook-form";

//Importing icons
import { ChevronLeft, LoaderCircle } from "lucide-react";
import { toast } from "react-toastify";
import { createBankAccount, updateBankAccount } from "../services/bankAccountService";

function BankAccountForm({selectedBankAccount, onClose}) {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(bankAccountSchema),
    defaultValues: {
      account_holdername:''
    }
  });

  useEffect(()=>{
    if(selectedBankAccount){
        reset({
            account_holdername:selectedBankAccount.account_holdername
        })
    }
  },[])


  const handleAddBankAccount = async (formData) =>{
     try{
        setLoading(true)
        const data = await createBankAccount(formData)
        toast.success("New bank account added successfully.")
        onClose(true)
     }catch(err){
        console.log(err)
        toast.error(errors?.message)
     }finally{
        setLoading(false)
     }
  }

  const handleEditBankAccount = async (formData) =>{
     try{
        setLoading(true)
        const data = await updateBankAccount(selectedBankAccount._id,formData)
        toast.success('Bank account details updated successfully.')
        onClose(true)
     }catch(err){
        console.log(err)
        toast.error(errors?.message)
     }finally{
        setLoading(false)
     }
  }

  return (
    <div className="fixed z-50 backdrop-blur-sm inset-0 bg-black/40 flex justify-center items-center">
        <div className="flex w-lg flex-col gap-4 bg-white rounded-2xl p-4">
           <div className="flex items-center gap-2">
             <ChevronLeft size={28} onClick={()=>onClose(false)} className="cursor-pointer"></ChevronLeft>
             <h1 className="text-2xl font-semibold">{selectedBankAccount ?"Edit Bank Account": "Add New Bank Account"}</h1>
           </div>
           <form onSubmit={handleSubmit(selectedBankAccount ? handleEditBankAccount : handleAddBankAccount)} className="flex flex-col gap-4">
             <div className="flex flex-col gap-2">
                <label>Account Holder Name <span className="text-sm text-red-500">*</span></label>
                <div className="flex flex-col">
                    <input
                    type="text"
                    {...register('account_holdername')}
                    className="p-2 border border-neutral-300 rounded-md outline-none"
                    placeholder="Enter account holder name" 
                    ></input>
                    {errors.account_holdername && <span className="text-sm text-red-500">{errors.account_holdername.message}</span>}
                </div>
             </div>
             <div className="flex justify-center items-center">
             <button type="submit" disabled={loading} className="p-2 hover:bg-blue-600 w-36 transition-all duration-300 cursor-pointer flex justify-center items-center bg-blue-500 rounded-md text-white font-medium">
                {
                  loading ? 
                  <LoaderCircle className="animate-spin"></LoaderCircle> :
                  selectedBankAccount ? 
                  "Save" :
                  "Submit"
                }
             </button>
          </div>
           </form>
        </div>
    </div>
  )
}

export default BankAccountForm