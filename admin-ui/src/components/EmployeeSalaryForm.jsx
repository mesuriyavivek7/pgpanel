import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

//Importing icons
import { ChevronLeft, LoaderCircle } from "lucide-react";
import { User } from "lucide-react";
import { House } from "lucide-react";
import { Phone } from "lucide-react";
import { WalletMinimal } from "lucide-react";
import { GraduationCap } from 'lucide-react';

import { toast } from "react-toastify";
import { capitalise, getShortMonthName, sliceString } from "../helper";
import Tooltip from "@mui/material/Tooltip";
import { employeeSalarySchema } from "../validations/employeeSalarySchema";
import { getEmployeeSalary } from "../services/employeeService";
import { createTransactionForEmployeePay } from "../services/transactionService";
import { getAllBankAccount } from '../services/bankAccountService';

function EmployeeSalaryForm({ employee , onClose }) {
  const [loading, setLoading] = useState(false);
  const [employeeError,setEmployeeError] = useState('')
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSalary,setSelectedSalary] = useState(null)
  const [bankAccounts,setBankAccounts] = useState([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(employeeSalarySchema(selectedSalary?.pending)),
    defaultValues: {
      amount: 0,
      date: "",
      payment_mode: "",
      bank_account:''
    },
  });

  useEffect(()=>{
    if(employee){
       setSelectedEmployee(employee)
       setCurrentStep(1)
       setSelectedSalary(employee.pending_salary[0])
       reset({
        amount:0,
        date:`${employee.pending_salary[0].month}-${employee.pending_salary[0].year}`,
        payment_mode:'',
        bank_account:''
       })
    }
  },[])

  useEffect(()=> {
    const handleGetBankAccounts = async () =>{
       try{
        const data = await getAllBankAccount()
        setBankAccounts(data)
       }catch(err){
        console.log(err)
        toast.error(err?.message)
       }
    }

    handleGetBankAccounts()
  },[])


  useEffect(() => {
    const handleFetchEmployeeSalary = async () => {
      try {
        const data = await getEmployeeSalary();
        setEmployees(data);
      } catch (err) {
        console.log(err);
        toast.error(err?.message || "Something went wrong.");
      }
    };

    handleFetchEmployeeSalary();
  }, []);

  const handleSelectEmployee = (e) => {
    let employeeId = e.target.value;
    if(!employeeId) return setSelectedEmployee('')
    let employee = employees.find((item) => item.employeeId === employeeId);
    if (employee){
        reset({
            amount:0,
            date:`${employee.pending_salary[0].month}-${employee.pending_salary[0].year}`,
            payment_mode:''
        })
        setSelectedSalary(employee.pending_salary[0])
        setSelectedEmployee(employee);
    } 
  };

  const handleSelectSalary = (e) => {
     let date = e.target.value
     let [month , year] = date.split('-')

     let salary = selectedEmployee?.pending_salary.find((item) => item.month === Number(month) && item.year === Number(year))
     setSelectedSalary(salary)
  }

  const handleNext = () =>{
     if(!selectedEmployee){
        setEmployeeError('Please select employee.')
        return
     }
     setEmployeeError('')
     setCurrentStep((prevStep) => prevStep + 1)
  }


  const handlePrev = () =>{
    setSelectedEmployee(null)
    setCurrentStep((prevStep)=> prevStep-1)
  }

  const handleSalaryPay = async (transactionData) =>{
     try{
       setLoading(true)
       let [month, year] = transactionData.date.split('-')
       let obj = {
         amount:transactionData.amount,
         payment_mode:transactionData.payment_mode,
         bank_account:transactionData.bank_account,
         employee:selectedEmployee?.employeeId,
         month:Number(month),
         year:Number(year)
       }
       const data = await createTransactionForEmployeePay(obj)
       onClose(true)
       toast.success('Salary paid to employee successfully.')
     }catch(err){
       console.log(err)
       toast.error(err?.message)
     }finally{
      setLoading(false)
     }
  }

  const renderForm = () => {
    switch (currentStep) {
      case 0:
        return (
         <div className="flex h-[580px] justify-between flex-col gap-4">
           <div className="flex flex-col gap-2">
            <label>
              Select Employee <span className="text-sm text-red-500">*</span>
            </label>
            <div className="flex flex-col">
              <select
                value={selectedEmployee?.employeeId}
                onChange={handleSelectEmployee}
                className="p-2 border border-neutral-300 rounded-md outline-none"
              >
                <option value={""}>-- Selecte Employee --</option>
                {employees.map((item, index) => (
                  <option key={index} value={item.employeeId}>
                    {item.employee_name}
                  </option>
                ))}
              </select>
              {employeeError && <span className="text-sm text-red-500">{employeeError}</span>}
            </div>
          </div>
          {
             selectedEmployee && 
             <div className="p-4 h-full bg-gray-100 rounded-2xl">
              <div className="grid grid-cols-2 items-center gap-4">
              <div className="flex items-center gap-2">
                <User></User>
                <span className="font-medium">{capitalise(selectedEmployee?.employee_name)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone></Phone>
                <span className="font-medium">{selectedEmployee?.mobile_no}</span>
              </div>
              <div className="flex items-center gap-2">
                <WalletMinimal></WalletMinimal>
                <span className="font-medium">₹{selectedEmployee?.salary}</span>
              </div>
              <div className="flex items-start gap-2">
                <House></House>
                <Tooltip title={selectedEmployee?.branch}>
                  <span className="font-medium">{sliceString(selectedEmployee?.branch, 20)}</span>
                </Tooltip>
              </div>
              <div className="flex items-start gap-2">
                <GraduationCap></GraduationCap>
                <span className="font-medium">{selectedEmployee?.employee_type}</span>
              </div>
              </div> 
             </div>
          }
          <div className="flex justify-center items-center">
              <button onClick={handleNext} className="p-2 hover:bg-blue-600 w-36 transition-all duration-300 cursor-pointer flex justify-center items-center bg-blue-500 rounded-md text-white font-medium">
                  Next
              </button>
          </div>
         </div>
        );
      case 1:
        return (
          <div className="flex h-[580px] flex-col gap-2">
            <div className="grid mb-4 grid-cols-2 items-center gap-4">
              <div className="flex items-center gap-2">
                <User></User>
                <span className="text-lg font-medium">{capitalise(selectedEmployee?.employee_name)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone></Phone>
                <span className="text-lg font-medium">{selectedEmployee?.mobile_no}</span>
              </div>
              <div className="flex items-center gap-2">
                <WalletMinimal></WalletMinimal>
                <span className="text-lg font-medium">₹{selectedEmployee?.salary}</span>
              </div>
              <div className="flex items-start gap-2">
                <House></House>
                <Tooltip title={selectedEmployee?.branch}>
                  <span className="text-lg font-medium">{sliceString(selectedEmployee?.branch, 20)}</span>
                </Tooltip>
              </div>
            </div>

            <form onSubmit={handleSubmit(handleSalaryPay)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label>Pending Amount</label>
                <span>₹{selectedSalary?.pending || 0}</span>
              </div>
              <div className="flex flex-col gap-2">
                <label>
                  Amount <span className="text-sm text-red-500">*</span>
                </label>
                <div className="flex flex-col">
                  <input
                    {...register("amount", { valueAsNumber: true })}
                    type="number"
                    placeholder="Enter amount"
                    className="p-2 border border-neutral-300 rounded-md outline-none"
                  ></input>
                  {errors.amount && (
                    <span className="text-sm text-red-500">
                      {errors.amount.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label>
                  Select Month/Year{" "}
                  <span className="text-sm text-red-500">*</span>
                </label>
                <div className="flex flex-col">
                  <select
                    {...register("date")}
                    onChange={handleSelectSalary}
                    className="p-2 border border-neutral-300 rounded-md outline-none"
                  >
                    {
                      selectedEmployee?.pending_salary.map((item,index)=>(
                         <option key={index} value={`${item.month}-${item.year}`}>{`${getShortMonthName(item.month)} ${item.year}`}</option>
                      ))
                   }
                  </select>
                  {errors.date && (
                    <span className="text-sm text-red-500">
                      {errors.date.message}
                    </span>
                  )}
                </div>
              </div>
              <div className='flex flex-col gap-1'>
                <label>Select Bank Account <span className='text-red-500 text-sm'>*</span></label>
                <div className='flex flex-col'>
                   <select 
                   {...register('bank_account')}
                   className='p-2 border border-neutral-300 rounded-md outline-none'>
                     <option value={''}>-- Select Bank Account --</option>
                     {
                       bankAccounts.map((item, index) => (
                        <option value={item._id} key={index}>{item.account_holdername}</option>
                       ))
                     }
                   </select>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label>Select Payment Mode</label>
                <div className="flex flex-col">
                  <select
                    {...register("payment_mode")}
                    className="p-2 border border-neutral-300 rounded-md outline-none"
                  >
                    <option value={""}>-- Select Payment Mode --</option>
                    <option value={"cash"}>Cash</option>
                    <option value={"upi"}>UPI</option>
                    <option value={"bank_transfer"}>Bank Transfer</option>
                  </select>
                  {errors.payment_mode && (
                    <span className="text-sm text-red-500">
                      {errors.payment_mode.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-center gap-2 items-center">
                {
                  !employee && 
                  <button onClick={handlePrev} className="p-2 bg-orange-400 hover:bg-orange-500 w-36 transition-all duration-300 cursor-pointer flex justify-center items-center rounded-md text-white font-medium"> 
                    Back
                  </button>
                }
                <button
                  type="submit"
                  disabled={loading}
                  className="p-2 hover:bg-blue-600 w-36 transition-all duration-300 cursor-pointer flex justify-center items-center bg-blue-500 rounded-md text-white font-medium"
                >
                  {loading ? (
                    <LoaderCircle className="animate-spin"></LoaderCircle>
                  ) : (
                    "Pay"
                  )}
                </button>
              </div>
            </form>
          </div>
        );
    }
  };

  return (
    <div className="fixed z-50 backdrop-blur-sm inset-0 bg-black/40 flex justify-center items-center">
      <div className="flex w-xl flex-col gap-4 bg-white rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <ChevronLeft
            size={28}
            onClick={() => onClose(false)}
            className="cursor-pointer"
          ></ChevronLeft>
          <h1 className="text-2xl font-semibold">Pay Salary</h1>
        </div>
        {renderForm()}
      </div>
    </div>
  );
}

export default EmployeeSalaryForm;
