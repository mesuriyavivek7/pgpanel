import { useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import { toast } from "react-toastify";
import { sliceString } from "../helper";

//Importing images
import VEG from '../assets/vegetables.png'
import GROCERIES from '../assets/groceries.png'
import OTHER from '../assets/product.png'
import BRANCH from "../assets/branch.png";
import CALENDAR from '../assets/calendar.png'

import { capitalise, formatDate } from "../helper";
import { getAllInventoryTransaction } from "../services/inventoryService";

const getItemImage = (inventory_type) =>{
    switch(inventory_type) {
        case "Vegetable":
            return VEG
        case "Grocery":
            return GROCERIES
        case "Other":
            return OTHER
    }
}

export const useInventoryTable = () => {
    const [rows,setRows] = useState([])
    const [loading,setLoading] = useState(false)

    const handleGetAllInventoryTransaction = async (searchQuery, branch) => {
        try{
           setLoading(true)
           const data = await getAllInventoryTransaction(searchQuery, branch)
           setRows(data)
        }catch(err) {
            console.log(err)
            toast.error(err?.message)
        } finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
       handleGetAllInventoryTransaction()
    },[])

    const columns = [
        {
            headerName: 'Item Name',
            field: 'refId.item_name',
            minWidth: 220,
            cellRenderer: (params) => (
              <div className="flex items-center w-full h-full">
                <div className="flex items-center gap-3">
                  <img
                    src={getItemImage(params.data.refId.item_type)}
                    alt="vendor"
                    className="w-9 h-9 rounded-full"
                  />
                  <span>{capitalise(params.value)}</span>
                </div>
              </div>
            )
        },
        {
            headerName: 'Amount',
            field: 'refId.amount',
            minWidth:150,
            cellRenderer: (params) => (
                <div className="flex items-center w-full h-full">
                   <span className="font-medium">₹{params.value}</span>
                </div>
            )
        },
        {
            headerName: 'Payment Mode',
            field:'payment_mode',
            minWidth:200,
            cellRenderer: (params) => (
                <div className="flex items-center w-full h-full">
                    <span className="font-medium">{params.value}</span>
                </div>
            )
        },
        {
            headerName: 'Branch',
            field: 'branch.branch_name',
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
            headerName: "Type",
            field: 'refId.item_type',
            minWidth:200,
            flex: 1,
            cellRenderer: (params) => (
                <div className="flex items-center w-full h-full">
                    <span>{params.value}</span>
                </div>
            )
        },
        {
            headerName: 'Date',
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

    return {columns, rows, loading, refetch:handleGetAllInventoryTransaction}
}