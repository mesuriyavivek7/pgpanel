import { useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import { toast } from "react-toastify";
import { getShortMonthName, sliceString } from "../helper";

//Importing images
import CHEF from "../assets/chef.png";
import WORKER from "../assets/worker.png";
import BRANCH from "../assets/branch.png";
import PHONE from "../assets/call.png";

import { capitalise } from "../helper";

import {
  getEmployeeSalary,
} from "../services/employeeService";

export const useEmployeeSalaryTable = (handleOpenForm) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGetEmployeeSalary = async (searchQuery="", branch="") => {
    try {
      setLoading(true);
      const data = await getEmployeeSalary(searchQuery, branch);
      setRows(data);
    } catch (err) {
      console.log(err);
      toast.error(err?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetEmployeeSalary();
  }, []);

  const columns = [
    {
      headerName: "Full Name",
      field: "employee_name",
      minWidth: 220,
      renderCell: (params) => (
        <div className="flex items-center w-full h-full">
          <div className="flex items-center gap-3">
            <img
              src={params.row.employee_type === "Co-Worker" ? WORKER : CHEF}
              alt="vendor"
              className="w-9 h-9 rounded-full"
            />
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
        headerName: 'Pending Salary',
        field:'pending_salary',
        minWidth: 250,
        flex: 1,
        renderCell: (params) => (
          <div className="flex items-center w-full h-full">
             <div className="flex items-center gap-2">
                {
                    params.value.map((item,index) => (
                        <div key={index} className={`flex p-1 border rounded-md ${item.required ? "bg-red-100" : "bg-neutral-50"} items-center gap-2`}>
                            <span className="leading-5">{getShortMonthName(item.month)}</span>
                            <span className="leading-5">{item.year}</span>
                        </div>
                    ))
                }
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
        headerName: 'Action',
            field: 'action',
            minWidth: 200,
            flex: 1,
            renderCell: (params) => {
                return (
                    <div className="flex items-center w-full h-full">
                        <button onClick={()=>handleOpenForm(params.row)} disabled={loading} className="bg-blue-500 hover:bg-blue-600 transition-colors duration-300 cursor-pointer text-lg w-32 text-white rounded-md p-1.5">
                            Pay Salary 
                        </button>
                    </div>
                )
            }
    }
  ];

  return {rows, loading, columns, refetch: handleGetEmployeeSalary}
};
