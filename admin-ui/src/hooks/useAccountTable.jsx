import { useEffect, useState, } from "react";
import Tooltip from '@mui/material/Tooltip';
import { toast } from "react-toastify";
import { sliceString } from "../helper";
import { GridActionsCellItem } from "@mui/x-data-grid";

//Importing images
import ADMIN from '../assets/admin.png'
import BRANCH from '../assets/branch.png'
import PHONE from '../assets/call.png'
import CALENDAR from '../assets/calendar.png'
import ACMANAGER from '../assets/acmanager.png'
import MAIL from '../assets/mail.png'

import { formatDate } from "../helper";
import { capitalise } from "../helper";

//Importing icons
import { UserPen } from 'lucide-react';
import { Minus } from 'lucide-react';
import { Check } from 'lucide-react';
import { changeAcmanagerStatus, getAllAcmanager } from "../services/accountService";



export const useAccountTable = (handleOpenForm) => {
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(false)

    const handleGetAllAccountManager = async (searchQuery, branch)=>{
        setLoading(true)
        try{
          const data = await getAllAcmanager(searchQuery, branch)
          console.log(data)
          setRows(data)
        }catch(err){
          console.log(err)
          toast.error(err?.message)
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
      handleGetAllAccountManager()
    },[])

    const handleChangeAccountManagerStatus = async (acmanagerId, status) =>{
        setLoading(true)
        try{
          const data = await changeAcmanagerStatus(acmanagerId,status)
          await handleGetAllAccountManager()
          toast.success("Acmanager status changed sucessfully.")
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
           icon={data.row.status ?<Minus size={22}></Minus>:<Check size={22}></Check>}
           label={data.row.status ? "Deactivate" : "Activate"}
           onClick={()=>handleChangeAccountManagerStatus(data.row._id, !data.row.status)}
           showInMenu
           ></GridActionsCellItem>, 
         )
       
       return actionArr

     }

    const columns = [
       {
        headerName: 'Full Name',
        field: 'full_name',
        minWidth: 220,
        renderCell: (params) => (
          <div className="flex items-center w-full h-full">
             <div className="flex items-center gap-3">
               <img src={ACMANAGER} alt="vendor" className="w-9 h-9 rounded-full" />
               <span>{capitalise(params.value)}</span>
             </div>
          </div>
        ),
       },
       {
        headerName: 'Mobile No',
        field: 'contact_no',
        minWidth: 200,
        renderCell: (params) => (
          <div className="flex w-full h-full items-center">
            <div className="flex items-center gap-2">
            <img src={PHONE} alt="phone" className="w-6 h-6 rounded-full" />
            <span>{params.value}</span>
            </div>
          </div>
        ),
       },
       {
        headerName: 'Email',
        field: 'email',
        minWidth: 250,
        renderCell: (params) => (
          <div className="flex w-full h-full items-center">
            <div className="flex items-center gap-2">
            <img src={MAIL} alt="email" className="w-6 h-6" />
            <span>{params.value}</span>
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
            <div className="flex items-center gap-2">
               <Tooltip title={params.row.branch[0].branch_name}>
                <div className="flex items-center gap-2">
                  <img src={BRANCH} alt="branch" className="w-7 h-7 rounded-full" />
                  <span>{sliceString(params.row.branch[0].branch_name,20)}</span>
                </div>
               </Tooltip>
               <Tooltip title={params.row.branch.map(b => b.branch_name).join(', ')}>
               <span className="rounded-full text-gray-600 text-sm w-7 flex justify-center items-center h-7 bg-gray-200">
                 +{params.row.branch.length-1}
               </span>
               </Tooltip>
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
          const isActive = params.value;
          return (
            <div className="flex items-center w-full h-full">
              <span className={`px-3 py-1 leading-5 flex justify-center items-center rounded-full w-20 text-white font-medium ${isActive===true ? 'bg-green-500' : 'bg-yellow-500'}`}>
                {params.value === true ? "Active" : "Inactive"}
              </span>
            </div>
          );
        },
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
              <span className="font-medium">{params.value.full_name}</span>
              <span className="text-sm">{params?.row?.added_by_type}</span>
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
      },  
    ]

    return {rows, columns, loading, refetch : handleGetAllAccountManager}
}