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
        toast.error(err?.message)
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
        toast.error(err?.message)
     }finally{
        setLoading(false)
     }
  }

  return (
    <div className="fixed z-50 backdrop-blur-sm inset-0 bg-black/40 flex justify-center items-center px-4 py-4 sm:px-6 sm:py-6">
        <div className="flex w-full max-w-xl flex-col gap-3 sm:gap-4 bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 max-h-[90vh] overflow-y-auto">
           <div className="flex items-center gap-2">
             <ChevronLeft size={24} className="sm:w-7 sm:h-7 cursor-pointer flex-shrink-0" onClick={()=>onClose(false)}></ChevronLeft>
             <h1 className="text-lg sm:text-xl md:text-2xl font-semibold break-words">{selectedBankAccount ?"Edit Bank Account": "Add New Bank Account"}</h1>
           </div>
           <form onSubmit={handleSubmit(selectedBankAccount ? handleEditBankAccount : handleAddBankAccount)} className="flex flex-col gap-3 sm:gap-4">
             <div className="flex flex-col gap-1.5 sm:gap-2">
                <label className="text-sm sm:text-base">Account Holder Name <span className="text-sm text-red-500">*</span></label>
                <div className="flex flex-col">
                    <input
                    type="text"
                    {...register('account_holdername')}
                    className="p-2 sm:p-2.5 text-sm sm:text-base border border-neutral-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter account holder name" 
                    ></input>
                    {errors.account_holdername && <span className="text-xs sm:text-sm text-red-500 mt-1">{errors.account_holdername.message}</span>}
                </div>
             </div>
             <div className="flex justify-center items-center pt-2">
             <button type="submit" disabled={loading} className="p-2.5 sm:p-3 hover:bg-blue-600 w-full sm:w-36 transition-all duration-300 cursor-pointer flex justify-center items-center bg-blue-500 rounded-md text-white font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed">
                {
                  loading ? 
                  <LoaderCircle className="animate-spin w-5 h-5"></LoaderCircle> :
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