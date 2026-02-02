import { useEffect, useState, } from "react";
import Tooltip from '@mui/material/Tooltip';
import { GridActionsCellItem } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { sliceString } from "../helper";

import { changeCustomerStatus, getAllCustomer } from "../services/customerService";

//Importing images
import ADMIN from '../assets/admin.png'
import BOY from '../assets/boy.png'
import BRANCH from '../assets/branch.png'
import PHONE from '../assets/call.png'
import CALENDAR from '../assets/calendar.png'

import { formatDate } from "../helper";
import { capitalise } from "../helper";

//Importing icons
import { UserPen, BadgeIndianRupee, UserRoundPlus, Trash } from 'lucide-react';
import { Minus } from 'lucide-react';
import { Check } from 'lucide-react';
import { Coins } from 'lucide-react';


export const useCustomerTable = (handleOpenForm, room, handleOpenDepositeForm, handleOpenAdvanceRentForm, handleOpenAdvanceBookingForm, handleOpenConfirmBox) =>{
    const [rows,setRows] = useState([])
    const [loading , setLoading] = useState(false)
    const navigate = useNavigate()


    const handleGetAllCustomers = async (searchQuery="", branch="", room="") =>{
       try{
         setLoading(true)
         const data = await getAllCustomer(searchQuery, branch, room)
         setRows(data)
       }catch(err){
         console.log(err)
         toast.error(err?.message)
       }finally{
        setLoading(false)
       }
    } 

    useEffect(()=>{
      handleGetAllCustomers("","",room)
    },[])

    const handleChangeCustomerStatus = async (customerId, status) =>{
      setLoading(true)
      try{
        const data = await changeCustomerStatus(customerId, status)
        await handleGetAllCustomers("", "", room)
        toast.success("Customer status changed successfully.")
      }catch(err){

        toast.error(err?.message || "Something went wrong.")
      }finally{
        setLoading(false)
      }
    }

    const renderAction = (data) =>{

      let actionArr = []

       actionArr.push(
           <GridActionsCellItem
           icon={<UserPen size={22}></UserPen>}
           label="Edit"
           onClick={()=>handleOpenForm(data.row)}
           showInMenu
           ></GridActionsCellItem>,
           <GridActionsCellItem
           icon={<Trash></Trash>}
           label="Delete"
           onClick={()=>handleOpenConfirmBox(data.row)}
           showInMenu
           ></GridActionsCellItem>,
           <GridActionsCellItem
           icon={data.row.status ? <Minus size={22}></Minus>:<Check size={22}></Check>}
           label={data.row.status === "Active" ? "Deactivate" : "Activate"}
           onClick={()=>handleChangeCustomerStatus(data.row._id, data.row.status === "Active" ? "Inactive" : "Active")}
           showInMenu
           ></GridActionsCellItem>, 
           <GridActionsCellItem
           icon={<Coins></Coins>}
           label="Advance Rent"
           onClick={()=>handleOpenAdvanceRentForm(data.row)}
           showInMenu
           ></GridActionsCellItem>

         )

      if(data.row.deposite_status === 'Pending'){
            actionArr.push(
              <GridActionsCellItem
               onClick={()=>handleOpenDepositeForm(data.row)}
               icon={<BadgeIndianRupee size={22}></BadgeIndianRupee>}
               label="Collect Deposite"
               showInMenu
              ></GridActionsCellItem>
            )
      }

      if(data.row.in_notice_period && !data.row.customer_replaced){
            actionArr.push(
              <GridActionsCellItem
              icon={<UserRoundPlus></UserRoundPlus>}
              onClick={()=>handleOpenAdvanceBookingForm(data.row)}
              label="Advance Booking"
              showInMenu
              ></GridActionsCellItem>
            )
      }
       
       return actionArr

     }
  
    const columns = [
        {
            headerName: 'Full Name',
            field: 'customer_name',
            minWidth: 220,
            renderCell: (params) => (
              <div className="flex items-center w-full h-full">
                 <div className="flex items-center gap-3">
                   <img src={BOY} alt="vendor" className="w-9 h-9 rounded-full" />
                   <div className="flex flex-col gap-1">
                     <span className="leading-5">{capitalise(params.value)}</span>
                     {params.row.in_notice_period && <span className="leading-5 w-22 text-xs flex justify-center items-center font-medium p-0.5 bg-blue-500 text-white rounded-2xl">On Notice</span>}
                   </div>
                 </div>
              </div>
            ),
          },
          {
            headerName: 'Mobile No',
            field: 'mobile_no',
            minWidth: 200,
            renderCell: (params) => (
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
            renderCell: (params) => (
              <div className="flex items-center w-full h-full">
                <div className="flex items-center gap-2">
                 <span>₹{params.value}</span>
                </div>
              </div>
            ),
          },
          {
            headerName: 'Rent Amount',
            field: 'rent_amount',
            minWidth: 200,
            flex: 1,
            renderCell: (params) => (
              <div className="flex items-center w-full h-full">
                <div className="flex items-center gap-2">
                 <span>₹{params.value}</span>
                </div>
              </div>
            ),
          },
          {
            headerName:'Status',
            field: 'status',
            minWidth: 140,
            flex: 1,
            renderCell: (params) => {
              const isActive = params.value === "Active";
              return (
                <div className="flex items-center w-full h-full">
                  <span className={`px-3 py-1 leading-5 flex justify-center items-center rounded-full w-20 text-white font-medium ${isActive===true ? 'bg-green-500' : 'bg-yellow-500'}`}>
                    {params.value === "Active" ? "Active" : "Inactive"}
                  </span>
                </div>
              );
            },
          },
          {
            headerName: 'Room No',
            field: 'room',
            minWidth: 160,
            flex: 1,
            renderCell: (params) => (
              <div className="flex items-center w-full h-full">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">{params.value.room_id}</span>
                 </div>
              </div>
            ),
          },
          {
            headerName: 'Branch',
            field: 'branch',
            minWidth: 260,
            flex: 1,
            renderCell: (params) => (
             <div className="flex items-center w-full h-full">
                <Tooltip title={params.value.branch_name}>
                 <div className="flex items-center gap-2">
                   <img src={BRANCH} alt="branch" className="w-7 h-7 rounded-full" />
                   <span>{sliceString(params.value.branch_name,20)}</span>
                 </div>
                </Tooltip>
             </div>
            ),
          },
          {
            headerName:'Deposite Status',
            field: 'deposite_status',
            minWidth: 160,
            flex: 1,
            renderCell: (params) => {
              const status = params.value;
              return (
                <div className="flex items-center w-full h-full">
                  <span className={`px-3 py-1 leading-5 flex justify-center items-center rounded-full w-20 text-white font-medium ${status==="Paid" ? 'bg-green-500' : 'bg-yellow-500'}`}>
                    {status === "Paid" ? "Paid" : `₹${params.row.deposite_amount - params.row.paid_deposite_amount}` }
                  </span>
                </div>
              );
            },
          },
          {
            headerName: 'Joining Date',
            field: 'joining_date',
            minWidth: 200,
            flex: 1,
            renderCell: (params) => (
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
            field: 'added_by',
            minWidth: 200,
            flex: 1,
            renderCell: (params) => (
              <div className="flex w-full h-full items-center">
                <div className="flex items-center gap-2">
                  <img src={ADMIN} alt="admin" className="w-7 h-7 rounded-full" />
                  <div className="flex flex-col">
                  <span className="font-medium leading-5">{params.value.full_name}</span>
                  <span className="text-sm">{params?.row?.added_by_type}</span>
                  </div>
              </div>
              </div>
            ),
          },
          {
            headerName: 'Actions',
            field: 'actions',
            type:'actions',
            minWidth: 150,
            getActions: (params) => renderAction(params)
          },        
    ]

    return {rows, columns, loading, refetch : handleGetAllCustomers}
}