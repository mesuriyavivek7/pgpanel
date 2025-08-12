import { useEffect, useState, } from "react";
import Tooltip from '@mui/material/Tooltip';
import { toast } from "react-toastify";
import { getShortMonthName, sliceString } from "../helper";


//Importing images
import BOY from '../assets/boy.png'
import BRANCH from '../assets/branch.png'
import PHONE from '../assets/call.png'

import { capitalise } from "../helper";

//Importing icons
import { getCustomerPendingRents } from "../services/customerService";


export const useCustomerRentTable = (handleOpenForm) =>{
    const [rows, setRows] = useState([])
    const [loading,setLoading] = useState(false)

    const handleGetAllCustomerRent = async (searchQuery="", branch="") =>{
        try{
           setLoading(true)
           const data = await getCustomerPendingRents()
           setRows(data)
        }catch(err){
            console.log(err)
            toast.error(err?.message)
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
       handleGetAllCustomerRent()
    },[])


    const columns = [
        {
            headerName: 'Full Name',
            field: 'customer_name',
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
            headerName: 'Room No',
            field: 'room.room_id',
            minWidth: 160,
            flex: 1,
            valueGetter: (params) => params.data.room?.room_id,
            cellRenderer: (params) => (
              <div className="flex items-center w-full h-full">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">{params.value}</span>
                 </div>
              </div>
            ),
        },
        {
            headerName: 'Branch',
            field: 'branch.branch_name',
            minWidth: 260,
            flex: 1,
            valueGetter: (params) => params.data.branch?.branch_name,
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
            headerName: 'Mobile No',
            field: 'mobile_no',
            minWidth: 200,
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
            headerName: 'Rent Amount',
            field: 'rent_amount',
            minWidth: 200,
            flex: 1,
            cellRenderer: (params) => (
              <div className="flex items-center w-full h-full">
                <div className="flex items-center gap-2">
                 <span>₹{params.value}</span>
                </div>
              </div>
            ),
          },
          {
            headerName: 'Months',
            field: 'pending_rent',
            minWidth: 230,
            cellRenderer: (params) =>(
                <div className="flex w-full h-full items-center">
                    <div className="flex items-center gap-2">
                        {
                            params.value.map((item,index)=> (
                                <div key={index} className={`flex p-1 border rounded-md ${item.required ? "bg-red-100" : "bg-neutral-50" } items-center gap-2`}>
                                  <span>{getShortMonthName(item.month)}</span>
                                  <span>{item.year}</span>
                                </div>
                            ))
                        }
                    </div>
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
                        <button disabled={loading} onClick={()=>handleOpenForm(params.data)} className="bg-blue-500 hover:bg-blue-600 transition-colors duration-300 cursor-pointer text-lg w-32 text-white rounded-md p-1.5">
                            Pay
                        </button>
                    </div>
                )
            }
          }
    ]

    return {columns, rows, loading, refetch: handleGetAllCustomerRent}
}