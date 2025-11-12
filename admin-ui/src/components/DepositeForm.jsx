import { useState, useEffect } from "react";
import React from "react";
import { getAllBankAccount } from "../services/bankAccountService";
import { createTransactionForDepositeCollection } from "../services/transactionService";
import { depositeSchema } from "../validations/depositeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

//Import icons
import { ChevronLeft, LoaderCircle } from "lucide-react";
import { toast } from "react-toastify";

function DepositeForm({ openForm, customer, onClose }) {
  const [bankAccounts, setBankAccounts] = useState([]);
  const [loader, setLoader] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(depositeSchema),
    defaultValues:{
        customer:customer?._id,
        amount:0,
        bank_account:'',
        payment_mode:''
    }
  });

  useEffect(()=>{
    reset({
        customer:customer?._id,
        amount:0,
        bank_account:'',
        payment_mode:''
    })
  },[customer])


  useEffect(() => {
    const handleGetAllBankAccounts = async () => {
      try {
        const data = await getAllBankAccount();
        setBankAccounts(data);
      } catch (err) {
        console.log(err);
        toast.error(err?.message);
      }
    };

    handleGetAllBankAccounts();
  }, []);

  const handleCollectDeposite = async (data) => {
    setLoader(true)
    try {
      const response = await createTransactionForDepositeCollection(data);
      toast.success("Deposite collected successfully.");
      onClose(true)
    } catch (err) {
      console.log(err);
      toast.error(err?.message || "Something went wrong.");
    } finally{
      setLoader(false)
    }
  };

  if (!openForm) return null;

  return (
    <div className="fixed z-50 backdrop-blur-sm inset-0 bg-black/40 flex justify-center items-center px-4 py-4 sm:px-6 sm:py-6">
      <div className="flex w-full max-w-md lg:max-w-lg flex-col gap-3 sm:gap-4 bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-2">
          <ChevronLeft
            size={24}
            className="sm:w-7 sm:h-7 cursor-pointer flex-shrink-0"
            onClick={() => onClose(false)}
          ></ChevronLeft>
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold break-words">
            Collect Deposite
          </h1>
        </div>
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="flex flex-col gap-1.5 sm:gap-2">
              <span className="font-medium text-sm sm:text-base">Deposite Amount</span>
              <span className="text-sm sm:text-base">₹{customer.deposite_amount}</span>
            </div>
            <div className="flex flex-col gap-1.5 sm:gap-2">
              <span className="font-medium text-sm sm:text-base">Pending Amount</span>
              <span className="text-sm sm:text-base">₹{customer.deposite_amount - customer.paid_deposite_amount}</span>
            </div>
          </div>
          <form onSubmit={handleSubmit(handleCollectDeposite)} className="flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-col gap-1.5 sm:gap-2">
              <label className="font-medium text-sm sm:text-base">Amount to Collect <span className='text-sm text-red-500'>*</span></label>
              <div className="flex flex-col">
               <input
                {...register("amount", { valueAsNumber: true })}
                placeholder="Enter Amount"
                type="number"
                className="w-full border border-neutral-300 rounded-md px-3 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
               />
               {errors.amount && (
                <span className="text-xs sm:text-sm text-red-500 mt-1">
                    {errors.amount.message}
                </span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1.5 sm:gap-2">
              <label className="font-medium text-sm sm:text-base">Select Bank Account <span className='text-sm text-red-500'>*</span></label>
              <div className="flex flex-col">
              <select
              {...register("bank_account")}
              className="w-full border border-neutral-300 rounded-md px-3 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">-- Select Bank Account --</option>
                {bankAccounts.map((account) => (
                  <option key={account._id} value={account._id}>
                    {account.account_holdername}
                  </option>
                ))}
              </select>
              {errors.bank_account && (
                <span className="text-xs sm:text-sm text-red-500 mt-1">
                    {errors.bank_account.message}
                </span>
              )}
              </div>
            </div>
            <div className="flex flex-col gap-1.5 sm:gap-2">
              <label className="font-medium text-sm sm:text-base">Payment Mode <span className='text-sm text-red-500'>*</span></label>
              <div className="flex flex-col">
                <select
                  {...register("payment_mode")}
                  className="w-full border border-neutral-300 rounded-md px-3 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={""}>--- Select Payment Mode ---</option>
                  <option value={"cash"}>Cash</option>
                  <option value={"upi"}>UPI</option>
                  <option value={"bank_transfer"}>Bank Transfer</option>
                </select>
                {errors.payment_mode && (
                  <span className="text-xs sm:text-sm text-red-500 mt-1">
                    {errors.payment_mode.message}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 items-center pt-2">
            <button 
              onClick={()=>onClose(false)} 
              className="p-2.5 sm:p-3 hover:bg-gray-100 transition-all duration-300 text-sm sm:text-base w-full sm:w-32 cursor-pointer flex justify-center items-center rounded-md border border-neutral-300 font-medium"
            >
              Cancel
            </button>
            <button 
              disabled={loader} 
              type="submit" 
              className="p-2.5 sm:p-3 w-full sm:min-w-32 text-sm sm:text-base transition-all duration-300 cursor-pointer flex justify-center items-center gap-2 bg-[#202947] hover:bg-[#2a3458] rounded-md text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {
                loader ? 
                <>
                  <LoaderCircle className="animate-spin w-5 h-5"></LoaderCircle>
                  <span>Submitting...</span>
                </>
                :"Submit"
              }
            </button>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DepositeForm;
