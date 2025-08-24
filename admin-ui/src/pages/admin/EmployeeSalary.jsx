import React, { useEffect, useState } from "react";

import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";

// ✅ AG Grid CSS (core and theme)
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css"; // Or any other theme

import Breadcrumb from "../../components/Breadcrumb";
import { useEmployeeSalaryTable } from "../../hooks/useEmployeeSalaryTable";
import EmployeeSalaryForm from "../../components/EmployeeSalaryForm";

ModuleRegistry.registerModules([AllCommunityModule]);

function EmployeeSalary() {
  const [openForm,setOpenForm] = useState(false)
  const [selectedEmployee,setSelectedEmployee] = useState(null) 
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBranch, setSelectedBranch] = useState("");
  
  const handleOpenForm = (employee = null) => {
    setSelectedEmployee(employee);
    setOpenForm(true);
  };

  const { loading, rows, columns, refetch } =
    useEmployeeSalaryTable(handleOpenForm);


  useEffect(()=>{
      refetch(searchQuery, selectedBranch)
  },[searchQuery,selectedBranch])  


  const handleCloseForm = (refresh) => {
    setSelectedEmployee(null);
    setOpenForm(false);
    if (refresh) refetch();
  };
  
  return (
    <div className="flex w-full h-full flex-col gap-8">
        {openForm && <EmployeeSalaryForm employee={selectedEmployee} onClose={handleCloseForm}></EmployeeSalaryForm>}
        <Breadcrumb
        onClick={handleOpenForm}
        selectedBranch={selectedBranch}
        setSelectedBranch={setSelectedBranch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        ></Breadcrumb>

        
      <div className="h-full ag-theme-alpine w-full">
        <AgGridReact
          rowData={rows}
          rowHeight={70}
          loading={loading}
          headerHeight={54}
          columnDefs={columns}
          modules={[AllCommunityModule]}
          pagination={true}
          paginationPageSize={10}
          defaultColDef={{
            resizable: true,
            sortable: true,
            // filter: true,
          }}
        />
      </div>

    </div>
  )
}

export default EmployeeSalary