import { useEffect, useState, } from "react";
import Tooltip from '@mui/material/Tooltip';
import { toast } from "react-toastify";
import { sliceString, formatDate } from "../helper";

//Importing images
import BOY from '../assets/boy.png'
import PHONE from '../assets/call.png'
import BANK from '../assets/bank.png'
import CALENDAR from '../assets/calendar.png'

import { capitalise } from "../helper";
import { getAllCashout } from "../services/cashoutService";

export const useCashoutTable = () =>{
    const [rows, setRows] = useState([])
    const [loading,setLoading] = useState(false)

    const handleGetAllCashout = async (searchQuery="", branch="") => {
        try{
            setLoading(true)
            const data = await getAllCashout(searchQuery, branch)
            setRows(data)
        }catch(err){
            console.log(err)
            toast.error(err?.message)
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
       handleGetAllCashout()
    },[])

    const columns = [
        {
            headerName: 'Person Name',
            field: 'refId.person_name',
            minWidth: 220,
            cellRenderer: (params) => (
              <div className="flex items-center w-full h-full">
                 <div className="flex items-center gap-3">
                   <img src={BOY} alt="vendor" className="w-9 h-9 rounded-full" />
                   <span>{capitalise(params.value)}</span>
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
            headerName: 'Mobile No',
            field: 'refId.mobile_no',
            minWidth: 220,
            cellRenderer: (params) => (
              <div className="flex w-full h-full items-center">
               <div className="flex items-center gap-2">
                <img src={PHONE} alt="phone" className="w-7 h-7 rounded-full" />
                <span>{params.value}</span>
               </div>
              </div>
            ),
        },
        {
            headerName: 'Notes',
            field: "refId.notes",
            minWidth: 200,
            cellRenderer: (params) => (
                <div className="flex w-full h-full items-center">
                    <div className="flex items-center gap-2">
                        <Tooltip title={params.value}>
                           <span>{sliceString(params.value, 20)}</span>
                        </Tooltip>
                    </div>
                </div>
            )
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

    return {columns, rows, loading, refetch:handleGetAllCashout}
}