import React, { useState } from "react";

import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";

// ✅ AG Grid CSS (core and theme)
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css"; // Or any other theme

import Breadcrumb from "../../components/Breadcrumb";
import { useCustomerRentTable } from "../../hooks/useCustomerRentTable";
import CustomerRentForm from "../../components/CustomerRentForm";

ModuleRegistry.registerModules([AllCommunityModule]);

function CustomerRent() {
  const [openForm, setOpenForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");

  const handleOpenForm = (customer = null) => {
    setSelectedCustomer(customer);
    setOpenForm(true);
  };

  const { loading, rows, columns, refetch } =
    useCustomerRentTable(handleOpenForm);

  const handleCloseForm = (refresh) => {
    setSelectedCustomer(null);
    setOpenForm(false);
    if (refresh) refetch();
  };

  return (
    <div className="flex w-full h-full flex-col gap-8">
      {openForm && <CustomerRentForm selectedCustomer={selectedCustomer} onClose={handleCloseForm}></CustomerRentForm>}
      <Breadcrumb
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
  );
}

export default CustomerRent;
