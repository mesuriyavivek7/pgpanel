import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";

// ✅ AG Grid CSS (core and theme)
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css"; // Or any other theme

import { useAccountTable } from "../../hooks/useAccountTable";
import Breadcrumb from "../../components/Breadcrumb";

function Accountmanager() {
  const [openForm, setOpenForm] = useState(false);
  const [selectedAcmanager, setSelectedAcmanager] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleOpenForm = (acmanager = null) => {
    setSelectedAcmanager(acmanager);
    setOpenForm(false);
  };

  const { rows, loading, columns, refetch } = useAccountTable(handleOpenForm);

  const handleCloseForm = (refresh = false) => {
    setSelectedAcmanager(null);
    setOpenForm(false);
    if (refresh) refetch(searchQuery);
  };

  return (
    <div className="flex w-full h-full flex-col gap-8">
      <Breadcrumb
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onClick={() => handleOpenForm(null)}
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

export default Accountmanager;
