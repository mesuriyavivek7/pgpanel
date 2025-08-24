import { useEffect, useState, } from "react";
import Tooltip from '@mui/material/Tooltip';
import { toast } from "react-toastify";
import { sliceString } from "../helper";

//Importing images
import BRANCH from '../assets/branch.png'
import BANK from '../assets/bank.png'
import CALENDAR from '../assets/calendar.png'

import { formatDate } from "../helper";
import { capitalise } from "../helper";

//Importing icons
import { getAllTransactions } from "../services/transactionService";

export const useTransactionTable = () =>{
    const [rows,setRows] = useState([])
    const [loading, setLoading] = useState(false)

    const handleGetAllTransaction = async (branch="", transactionType="") =>{
        setLoading(true)
        try{
          const data = await getAllTransactions(branch, transactionType)
          setRows(data)
        }catch(err){
          console.log(err) 
          toast.error(err?.message)
        }finally{
          setLoading(false)
        }
    }

    useEffect(()=>{
       handleGetAllTransaction()
    },[])

    const getTransactionType = (transactionType) =>{
        switch(transactionType){
          case "customer_rent":
            return "Rent"
          case "employee_salary":
            return "Salary"
          case "inventory_purchase":
            return "Inventory"
          case "cash_given":
            return "Cashout"
          case "monthly_bill":
            return "Monthly Bill"
          default:
            return "Transaction"
        }
    }

    const columns = [
       {
        headerName: 'Transaction Type',
        field: 'type',
        minWidth: 220,
        cellRenderer: (params) => (
          <div className="flex items-center w-full h-full">
             <div className="flex items-center gap-3">
               <span>{getTransactionType(params.value)}</span>
             </div>
          </div>
        ),
       },
       {
        headerName: 'Amount',
        field: 'refId.amount',
        minWidth: 200,
        flex: 1,
        cellRenderer: (params) => (
          <div className="flex items-center w-full h-full">
            <div className="flex items-center gap-2">
             <span className={`${params.data.transactionType === "expense" ? "text-red-500" : "text-green-500"}`}>{params.data.transactionType === "expense" ? "-" : "+"} ₹{params.value}</span>
            </div>
          </div>
        ),
        },
        {
            headerName: "Payment Mode",
            field: 'payment_mode',
            minWidth:200,
            flex:1,
            cellRenderer: (params) => (
                <div className="flex items-center w-full h-full">
                    <div className="flex items-center gap-2">
                        <span>{capitalise(params.value)}</span>
                    </div>
                </div>
            )
        },
        {
            headerName: 'Bank Account',
            field: 'bank_account.account_holdername',
            minWidth:240,
            cellRenderer: (params) => (
                <div className="flex items-center w-full h-full">
                    <div className="flex items-center gap-2">
                        <img src={BANK} alt="bank" className="w-7 h-7" />
                        <span>{params.value}</span>
                    </div>
                </div>
            )
        },
        {
          headerName: 'Branch',
          field: 'branch.branch_name',
          minWidth: 260,
          flex: 1,
          valueGetter: (params) => params.data?.branch?.branch_name,
          cellRenderer: (params) => (
           <div className="flex items-center w-full h-full">
              <Tooltip title={params.value}>
               <div className="flex items-center gap-2">
                 <img src={BRANCH} alt="branch" className="w-7 h-7 rounded-full" />
                 <span>{sliceString(params?.value,20)}</span>
               </div>
              </Tooltip>
           </div>
          ),
        },
        {
            headerName: 'Created At',
            field:'createdAt',
            minWidth: 200,
            flex: 1,
            cellRenderer: (params) => (
                <div className="flex items-center w-full h-full">
                  <div className="flex items-center gap-2">
                    <img src={CALENDAR} alt="calendar" className="w-7 h-7" />
                    <span className="font-medium">{formatDate(params.value)}</span>
                  </div>
                </div>
            ),
        },
    ]

    return {columns, rows, loading, refetch:handleGetAllTransaction}
}