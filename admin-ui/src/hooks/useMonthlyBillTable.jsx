import { useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import { toast } from "react-toastify";
import { sliceString } from "../helper";

//Importing images
import BRANCH from "../assets/branch.png";
import BILL from '../assets/invoice.png'

import { SquarePen } from 'lucide-react';
import { Trash } from 'lucide-react';


import { capitalise } from "../helper";
import { getAllMonthlyBill } from "../services/monthlyBillService";
import { getShortMonthName } from "../helper";

export const useMonthlyBillTable = (handleOpenForm, handleOpenConfirmationBox, handleOpenPayForm) =>{
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(false)

    const handleGetAllMonthlyBills = async (searchQuery="", branch="") =>{
        setLoading(true)
        try{
            const data = await getAllMonthlyBill(searchQuery, branch)
            setRows(data)
        }catch(err){
            console.log(err)
            toast.error(err?.message)
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
       handleGetAllMonthlyBills()
    },[])


    const columns = [
        {
            headerName: 'Bill Name',
            field: 'billName',
            minWidth: 220,
            cellRenderer: (params) => (
              <div className="flex items-center w-full h-full">
                <div className="flex items-center gap-3">
                  <img src={BILL} alt="bill" className="w-7 h-7" />
                  <span>{capitalise(params.value)}</span>
                </div>
              </div>
            )
        },
        {
            headerName: 'Amount',
            field: 'amount',
            minWidth: 220,
            cellRenderer: (params) => (
              <div className="flex items-center w-full h-full">
                <div className="flex items-center gap-3">
                  <span className="font-medium">₹{params.value}</span>
                </div>
              </div>
            )
        },
        {
            headerName: 'Branch',
            field: 'branch',
            minWidth: 260,
            flex: 1,
            valueGetter: (params) => params.data.branch.branch_name,
            cellRenderer: (params) => (
             <div className="flex items-center w-full h-full">
                <Tooltip title={params.value}>
                 <div className="flex items-center gap-2">
                   <img src={BRANCH} alt="branch" className="w-7 h-7 rounded-full" />
                   <span>{sliceString(params.value,20)}</span>
                 </div>
                </Tooltip>
             </div>
            ),
        },
        {
            headerName: 'Pending Months',
            field:'pendingMonths',
            minWidth: 250,
            flex: 1,
            cellRenderer: (params) => (
              <div className="flex items-center w-full h-full">
                 <div className="flex items-center gap-2">
                    {
                     params.value.map((item,index) => (
                        <div key={index} className={`flex p-1 border rounded-md ${item.required ? "bg-red-100" : "bg-neutral-50"} items-center gap-2`}>
                            <span>{getShortMonthName(item.month)}</span>
                            <span>{item.year}</span>
                        </div>
                     ))
                    }
                 </div>
              </div>
            ),
        },
        {
            headerName: 'Notes',
            field:'notes',
            minWidth: 250,
            flex: 1,
            cellRenderer: (params) => (
                <div className="flex items-center w-full h-full">
                    <Tooltip title={params.value}> 
                       <p>{sliceString(params.value, 20)}</p>
                    </Tooltip>
                </div>
            )
        },
        {
            headerName: 'Action',
            field: 'action',
            minWidth: 250,
            flex: 1,
            cellRenderer: (params) => {
                return (
                    <div className="flex items-center gap-2 w-full h-full">
                        {
                            params.data.pendingMonths.length > 0 ? 
                             <button onClick={()=>handleOpenPayForm(params.data)} disabled={loading} className="bg-blue-500 hover:bg-blue-600 transition-colors duration-300 cursor-pointer text-base w-28 text-white rounded-md p-1.5">
                              Pay Salary 
                             </button>
                            : <span> - </span>
                        }
                        <button onClick={()=>handleOpenForm(params.data)} className="p-1.5 bg-orange-500 text-white rounded-md cursor-pointer hover:bg-orange-600 transition-all duration-300">
                            <SquarePen  size={18}></SquarePen>
                        </button>
                        <button onClick={()=>handleOpenConfirmationBox(params.data)} className="p-1.5 bg-red-500 text-white rounded-md cursor-pointer hover:bg-red-600 transition-all duration-300">
                            <Trash size={18}></Trash>
                        </button>
                    </div>
                )
            }
        }
    ]

    return {rows, loading, columns, refetch: handleGetAllMonthlyBills}
    
}