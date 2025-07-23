import { useCallback, useEffect, useState, } from "react";
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { sliceString } from "../helper";

import { getAllCustomer } from "../services/customerService";

//Importing images
import ADMIN from '../assets/admin.png'
import BOY from '../assets/boy.png'
import BRANCH from '../assets/branch.png'
import PHONE from '../assets/call.png'
import CALENDAR from '../assets/calendar.png'

import { formatDate } from "../helper";
import { capitalise } from "../helper";

//Importing icons
import { UserPen } from 'lucide-react';
import { Minus } from 'lucide-react';
import { Check } from 'lucide-react';


export const useCustomerTable = () =>{
    const [rows,setRows] = useState([])
    const [loading , setLoading] = useState(false)
    const navigate = useNavigate()


    const handleGetAllCustomers = async () =>{
       try{
         setLoading(true)
         const data = await getAllCustomer()
         setRows(data)
       }catch(err){
         console.log(err)
         toast.error(err?.message)
       }finally{
        setLoading(false)
       }
    } 

    useEffect(()=>{
      handleGetAllCustomers()
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
            headerName: 'Deposite Amount',
            field: 'deposite_amount',
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
            headerName: 'Joining Date',
            field: 'joining_date',
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
          {
            headerName: 'Added By',
            field: 'added_by.full_name',
            minWidth: 200,
            flex: 1,
            valueGetter: (params) => params.data.added_by?.full_name,
            cellRenderer: (params) => (
              <div className="flex w-full h-full items-center">
                <div className="flex items-center gap-2">
                  <img src={ADMIN} alt="admin" className="w-7 h-7 rounded-full" />
                  <div className="flex flex-col">
                  <span className="font-medium">{params.value}</span>
                  <span className="text-sm">{params?.data?.added_by_type}</span>
                  </div>
              </div>
              </div>
            ),
          },
          {
            headerName: 'Action',
            field: 'action',
            minWidth: 200,
            flex: 1,
            cellRenderer: (params) => {
              const isActive = params.data.status;
              return (
                <div className="flex items-center w-full h-full">
                 <div className="flex items-center gap-2">
                  <Tooltip title="Edit">
                    <button className="flex cursor-pointer bg-blue-500 text-white p-1 justify-center items-center rounded-full">
                      <UserPen size={18} />
                    </button>
                  </Tooltip>
                  <Tooltip title={isActive ? 'Inactivate' : 'Activate'}>
                    <button
                      className={`flex cursor-pointer p-1 justify-center items-center rounded-full ${
                        isActive ? 'bg-red-500' : 'bg-green-500'
                      } text-white`}
                    >
                      {isActive ? <Minus size={18} /> : <Check size={18} />}
                    </button>
                  </Tooltip>
                </div>
                </div>
              );
            },
          },        
    ]

    return {rows, columns, loading, refetch : handleGetAllCustomers}
}