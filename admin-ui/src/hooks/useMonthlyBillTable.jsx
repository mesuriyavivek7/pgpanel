import { useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import { toast } from "react-toastify";
import { sliceString } from "../helper";

//Importing images
import BRANCH from "../assets/branch.png";


import { capitalise } from "../helper";
import { getAllMonthlyBill } from "../services/monthlyBillService";

export const useMonthlyBillTable = () =>{
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(false)

    const handleGetAllMonthlyBills = async () =>{
        try{
            const data = await getAllMonthlyBill()
            setRows(data)
        }catch(err){
            console.log(err)
            toast.error(err?.message)
        }finally{
            setLoading(false)
        }
    }


    const columns = [
        {
            headerName: 'Bill Name',
            field: 'payment_name',
            minWidth: 220,
            cellRenderer: (params) => (
              <div className="flex items-center w-full h-full">
                <div className="flex items-center gap-3">
                  <span>{capitalise(params.value)}</span>
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
            field:'pending_months',
            minWidth: 250,
            flex: 1,
            cellRenderer: (params) => (
              <div className="flex items-center w-full h-full">
                 <div className="flex items-center gap-2">
                    {
                        params.pending ? 
                         params.value.map((item,index) => (
                            <div key={index} className={`flex p-1 border rounded-md items-center gap-2`}>
                                <span>{getShortMonthName(item.month)}</span>
                                <span>{item.year}</span>
                            </div>
                         ))
                        : <span className="bg-green-500 text-white">Completed</span>
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
            minWidth: 200,
            flex: 1,
            cellRenderer: (params) => {
                return (
                    <div className="flex items-center w-full h-full">
                        {
                            params.pending ? 
                             <button onClick={()=>handleOpenForm(params.data)} disabled={loading} className="bg-blue-500 hover:bg-blue-600 transition-colors duration-300 cursor-pointer text-lg w-32 text-white rounded-md p-1.5">
                              Pay Salary 
                             </button>
                            : <span> - </span>
                        }
                       
                    </div>
                )
            }
        }
    ]

    return {rows, loading, columns, refetch: handleGetAllMonthlyBills}
    
}