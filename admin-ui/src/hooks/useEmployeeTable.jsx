import { useEffect, useState, } from "react";
import Tooltip from '@mui/material/Tooltip';
import { GridActionsCellItem } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import { sliceString } from "../helper";

//Importing images
import ADMIN from '../assets/admin.png'
import CHEF from '../assets/chef.png'
import WORKER from '../assets/worker.png'
import BRANCH from '../assets/branch.png'
import PHONE from '../assets/call.png'
import CALENDAR from '../assets/calendar.png'

import { formatDate } from "../helper";
import { capitalise } from "../helper";

//Importing icons
import { Trash, UserPen, Wallet } from 'lucide-react';
import { Minus } from 'lucide-react';
import { Check } from 'lucide-react';
import { changeEmployeeStatus, getAllEmployee } from "../services/employeeService";

export const useEmployeeTable = (handleOpenForm, handleOpenAdvanceRentForm, handleOpenConfirmBox) => {
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(false)
   

    const handleGetAllEmployee = async (searchQuery, branch) =>{
        try{
            setLoading(true)
            const data = await getAllEmployee(searchQuery, branch)
            setRows(data)
        }catch(err){
            console.log(err)
            toast.error(err?.message)
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
       handleGetAllEmployee()
    },[])

    const handleChangeEmployeeStatus = async (employeeId, status) =>{
       setLoading(true)
       try{
         const data = await changeEmployeeStatus(employeeId, status)
         await handleGetAllEmployee()
         toast.success('Employee status changed successfully.')
       }catch(err){
         toast.error(err?.message)
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
           icon={data.row.status?<Minus size={22}></Minus>:<Check size={22}></Check>}
           label={data.row.status === "Active" ? "Deactivate" : "Activate"}
           onClick={()=>handleChangeEmployeeStatus(data.row._id, data.row.status === "Active" ? "Inactive" : "Active")}
           showInMenu
           ></GridActionsCellItem>, 
           <GridActionsCellItem
           icon={<Wallet></Wallet>}
           label="Advance Salary"
           onClick={()=>handleOpenAdvanceRentForm(data.row)}
           showInMenu
           ></GridActionsCellItem>
         )
       

       return actionArr

     }
    
    const columns = [
        {
            headerName: 'Full Name',
            field: 'employee_name',
            minWidth: 220,
            renderCell: (params) => (
              <div className="flex items-center w-full h-full">
                 <div className="flex items-center gap-3">
                   <img src={params.row.employee_type==="Co-Worker"?WORKER:CHEF} alt="vendor" className="w-9 h-9 rounded-full" />
                   <span>{capitalise(params.value)}</span>
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
            headerName: 'Salary',
            field: 'salary',
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
            headerName: 'Employee Type',
            field: 'employee_type',
            minWidth: 200,
            flex: 1,
            renderCell: (params) => (
              <div className="flex items-center w-full h-full">
                <div className="flex items-center gap-2">
                 <span className="font-medium">{params.value}</span>
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
                  <span className="text-sm leading-5">{params?.row?.added_by_type}</span>
                  </div>
              </div>
              </div>
            ),
        },
        {
            headerName: 'Created At',
            field:'createdAt',
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
          headerName: 'Actions',
          field: 'actions',
          type:'actions',
          minWidth: 150,
          getActions: (params) => renderAction(params)
        }
    ]

   return {rows, columns, loading, refetch : handleGetAllEmployee}
}