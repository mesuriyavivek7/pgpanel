import { Plus, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getAllBranch } from "../services/branchService";

function Breadcrumb({
  selectedBranch,
  setSelectedBranch,
  searchQuery,
  setSearchQuery,
  selectedTransactions,
  setSelectedTransactions,
  onClick,
}) {
  const location = useLocation();
  const [branch, setBranch] = useState([]);

  useEffect(() => {
    const handleGetAllBranch = async () => {
      try {
        const data = await getAllBranch();
        setBranch(data);
      } catch (err) {
        console.log(err);
      }
    };

    handleGetAllBranch();
  }, []);

  const getContent = () => {
    switch (location.pathname) {
      case "/admin":
        return <h1 className="text-2xl sm:text-3xl font-semibold">Dashboard</h1>;

      case "/admin/branches":
        return (
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-3 sm:gap-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">Branches</h1>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="border rounded-2xl border-neutral-300 bg-white p-1.5 md:p-2 flex-1 sm:flex-none sm:w-48 md:w-72 flex items-center gap-2">
                <Search className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"></Search>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                  className="flex-1 outline-none text-sm sm:text-base"
                  placeholder="Search branch"
                ></input>
              </div>
              <button
                onClick={() => onClick()}
                className="p-1.5 md:p-2 bg-blue-500 transition-all duration-300 hover:bg-blue-600 font-medium cursor-pointer backdrop-blur-md rounded-md text-white flex-shrink-0"
              >
                <span className="hidden md:block">Add New Branch</span>
                <Plus className="block md:hidden w-5 h-5"></Plus>
              </button>
            </div>
          </div>
        );

      case "/admin/branches/preview":
      case "/account/branches/preview":
        return (
          <div className="flex w-full flex-col gap-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">
              Branch Preview
            </h1>
            <span className="text-gray-400 text-sm sm:text-base">
              View and manage details for your branch.
            </span>
          </div>
        );

      case "/account/customers":
      case "/admin/customers":
        return (
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-3 sm:gap-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">Customers</h1>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <div className="border rounded-2xl border-neutral-300 bg-white p-1.5 md:p-2 flex-1 sm:flex-none sm:w-48 md:w-72 flex items-center gap-2">
                <Search className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"></Search>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                  className="flex-1 outline-none text-sm sm:text-base"
                  placeholder="Search customers"
                ></input>
              </div>
              <select
                onChange={(e) => setSelectedBranch(e.target.value)}
                value={selectedBranch}
                className="p-2 px-4 border rounded-2xl border-neutral-300 bg-white outline-none text-sm sm:text-base w-full sm:w-52"
              >
                <option value={""}>All Branch</option>
                {branch.map((item, index) => (
                  <option key={index} value={item._id}>
                    {item.branch_name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => onClick()}
                className="p-1.5 md:p-2 bg-blue-500 transition-all duration-300 hover:bg-blue-600 font-medium cursor-pointer backdrop-blur-md rounded-2xl text-white flex-shrink-0"
              >
                <span className="hidden md:block">Add New Customer</span>
                <Plus className="block md:hidden w-5 h-5"></Plus>
              </button>
            </div>
          </div>
        );

      case "/admin/employees":
      case "/account/employees":
        return (
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-3 sm:gap-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">Employees</h1>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <div className="border rounded-2xl border-neutral-300 bg-white p-1.5 md:p-2 flex-1 sm:flex-none sm:w-48 md:w-72 flex items-center gap-2">
                <Search className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"></Search>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                  className="flex-1 outline-none text-sm sm:text-base"
                  placeholder="Search employees"
                ></input>
              </div>
              <select
                onChange={(e) => setSelectedBranch(e.target.value)}
                value={selectedBranch}
                className="p-2 px-4 border rounded-2xl border-neutral-300 bg-white outline-none text-sm sm:text-base w-full sm:w-52"
              >
                <option value={""}>All Branch</option>
                {branch.map((item, index) => (
                  <option key={index} value={item._id}>
                    {item.branch_name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => onClick()}
                className="p-1.5 md:p-2 bg-blue-500 transition-all duration-300 hover:bg-blue-600 font-medium cursor-pointer backdrop-blur-md rounded-md text-white flex-shrink-0"
              >
                <span className="hidden md:block">Add New Employee</span>
                <Plus className="block md:hidden w-5 h-5"></Plus>
              </button>
            </div>
          </div>
        );

      case "/admin/accountmanagers":
        return (
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-3 sm:gap-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">
              Account Managers
            </h1>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <div className="border rounded-2xl border-neutral-300 bg-white p-1.5 md:p-2 flex-1 sm:flex-none sm:w-48 md:w-72 flex items-center gap-2">
                <Search className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"></Search>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                  className="flex-1 outline-none text-sm sm:text-base"
                  placeholder="Search account managers"
                ></input>
              </div>
              <select
                onChange={(e) => setSelectedBranch(e.target.value)}
                value={selectedBranch}
                className="p-2 px-4 border rounded-2xl border-neutral-300 bg-white outline-none text-sm sm:text-base w-full sm:w-52"
              >
                <option value={""}>All Branch</option>
                {branch.map((item, index) => (
                  <option key={index} value={item._id}>
                    {item.branch_name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => onClick()}
                className="p-1.5 md:p-2 bg-blue-500 transition-all duration-300 hover:bg-blue-600 font-medium cursor-pointer backdrop-blur-md rounded-md text-white flex-shrink-0"
              >
                <span className="hidden md:block">Add New AcManager</span>
                <Plus className="block md:hidden w-5 h-5"></Plus>
              </button>
            </div>
          </div>
        );

      case "/admin/rents":
      case "/account/rents":
        return (
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-3 sm:gap-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">
              Pending Rents
            </h1>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <div className="border rounded-2xl border-neutral-300 bg-white p-1.5 md:p-2 flex-1 sm:flex-none sm:w-48 md:w-72 flex items-center gap-2">
                <Search className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"></Search>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                  className="flex-1 outline-none text-sm sm:text-base"
                  placeholder="Search customer"
                ></input>
              </div>
              <select
                onChange={(e) => setSelectedBranch(e.target.value)}
                value={selectedBranch}
                className="p-2 px-4 border rounded-2xl border-neutral-300 bg-white outline-none text-sm sm:text-base w-full sm:w-52"
              >
                <option value={""}>All Branch</option>
                {branch.map((item, index) => (
                  <option key={index} value={item._id}>
                    {item.branch_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case "/admin/salary":
      case "/account/salary":
        return (
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-3 sm:gap-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">
              Employee Salary
            </h1>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <div className="border rounded-2xl border-neutral-300 bg-white p-1.5 md:p-2 flex-1 sm:flex-none sm:w-48 md:w-72 flex items-center gap-2">
                <Search className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"></Search>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                  className="flex-1 outline-none text-sm sm:text-base"
                  placeholder="Search employee"
                ></input>
              </div>
              <select
                onChange={(e) => setSelectedBranch(e.target.value)}
                value={selectedBranch}
                className="p-2 px-4 border rounded-2xl border-neutral-300 bg-white outline-none text-sm sm:text-base w-full sm:w-52"
              >
                <option value={""}>All Branch</option>
                {branch.map((item, index) => (
                  <option key={index} value={item._id}>
                    {item.branch_name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => onClick()}
                className="p-1.5 md:p-2 bg-blue-500 transition-all duration-300 hover:bg-blue-600 font-medium cursor-pointer backdrop-blur-md rounded-md text-white flex-shrink-0"
              >
                <span className="hidden md:block">Create Salary</span>
                <Plus className="block md:hidden w-5 h-5"></Plus>
              </button>
            </div>
          </div>
        );

      case "/admin/inventory":
      case "/account/inventory":
        return (
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-3 sm:gap-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">Inventory</h1>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <div className="border rounded-2xl border-neutral-300 bg-white p-1.5 md:p-2 flex-1 sm:flex-none sm:w-48 md:w-72 flex items-center gap-2">
                <Search className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"></Search>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                  className="flex-1 outline-none text-sm sm:text-base"
                  placeholder="Search inventory"
                ></input>
              </div>
              <select
                onChange={(e) => setSelectedBranch(e.target.value)}
                value={selectedBranch}
                className="p-2 px-4 border rounded-2xl border-neutral-300 bg-white outline-none text-sm sm:text-base w-full sm:w-52"
              >
                <option value={""}>All Branch</option>
                {branch.map((item, index) => (
                  <option key={index} value={item._id}>
                    {item.branch_name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => onClick()}
                className="p-1.5 md:p-2 bg-blue-500 transition-all duration-300 hover:bg-blue-600 font-medium cursor-pointer backdrop-blur-md rounded-2xl text-white flex-shrink-0"
              >
                <span className="hidden md:block">Create Inventory</span>
                <Plus className="block md:hidden w-5 h-5"></Plus>
              </button>
            </div>
          </div>
        );

      case "/admin/monthlybill":
        return (
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-3 sm:gap-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">
              Monthly Bills
            </h1>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <div className="border rounded-2xl border-neutral-300 bg-white p-1.5 md:p-2 flex-1 sm:flex-none sm:w-48 md:w-72 flex items-center gap-2">
                <Search className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"></Search>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                  className="flex-1 outline-none text-sm sm:text-base"
                  placeholder="Search bill"
                ></input>
              </div>
              <select
                onChange={(e) => setSelectedBranch(e.target.value)}
                value={selectedBranch}
                className="p-2 px-4 border rounded-2xl border-neutral-300 bg-white outline-none text-sm sm:text-base w-full sm:w-52"
              >
                <option value={""}>All Branch</option>
                {branch.map((item, index) => (
                  <option key={index} value={item._id}>
                    {item.branch_name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => onClick()}
                className="p-1.5 md:p-2 bg-blue-500 transition-all duration-300 hover:bg-blue-600 font-medium cursor-pointer backdrop-blur-md rounded-2xl text-white flex-shrink-0"
              >
                <span className="hidden md:block">Create Bill</span>
                <Plus className="block md:hidden w-5 h-5"></Plus>
              </button>
            </div>
          </div>
        );

      case "/admin/cashout":
        return (
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-3 sm:gap-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">Cashout</h1>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="border rounded-2xl border-neutral-300 bg-white p-1.5 md:p-2 flex-1 sm:flex-none sm:w-48 md:w-72 flex items-center gap-2">
                <Search className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"></Search>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                  className="flex-1 outline-none text-sm sm:text-base"
                  placeholder="Search by person name"
                ></input>
              </div>
              <button
                onClick={() => onClick()}
                className="p-1.5 md:p-2 md:px-4 bg-blue-500 transition-all duration-300 hover:bg-blue-600 font-medium cursor-pointer backdrop-blur-md rounded-2xl text-white flex-shrink-0"
              >
                <span className="hidden md:block">Create Cashout</span>
                <Plus className="block md:hidden w-5 h-5"></Plus>
              </button>
            </div>
          </div>
        );

      case "/admin/transactions":
      case "/account/transactions":
        return (
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-3 sm:gap-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">Transactions</h1>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <select
                onChange={(e) => setSelectedBranch(e.target.value)}
                value={selectedBranch}
                className="p-2 px-4 border rounded-2xl border-neutral-300 bg-white outline-none text-sm sm:text-base w-full sm:w-52"
              >
                <option value={""}>All Branch</option>
                {branch.map((item, index) => (
                  <option key={index} value={item._id}>
                    {item.branch_name}
                  </option>
                ))}
              </select>
              <select
                value={selectedTransactions}
                onChange={(e) => setSelectedTransactions(e.target.value)}
                className="p-2 px-4 border rounded-2xl border-neutral-300 bg-white outline-none text-sm sm:text-base w-full sm:w-52"
              >
                <option value={""}>All Transaction</option>
                <option value={"customer_rent"}>Rent</option>
                <option value={"employee_salary"}>Salary</option>
                <option value={"monthly_bill"}>Monthly Bill</option>
                <option value={"inventory_purchase"}>Inventory</option>
                <option value={"cash_given"}>Cashout</option>
              </select>
            </div>
          </div>
        );

      case "/account/branches":
        return (
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-3 sm:gap-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">Branches</h1>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="border rounded-2xl border-neutral-300 bg-white p-1.5 md:p-2 flex-1 sm:flex-none sm:w-48 md:w-72 flex items-center gap-2">
                <Search className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"></Search>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                  className="flex-1 outline-none text-sm sm:text-base"
                  placeholder="Search branch"
                ></input>
              </div>
            </div>
          </div>
        );

      case "/account/monthlybill":
        return (
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-3 sm:gap-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">
              Monthly Bills
            </h1>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <div className="border rounded-2xl border-neutral-300 bg-white p-1.5 md:p-2 flex-1 sm:flex-none sm:w-48 md:w-72 flex items-center gap-2">
                <Search className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"></Search>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                  className="flex-1 outline-none text-sm sm:text-base"
                  placeholder="Search bill"
                ></input>
              </div>
              <select
                onChange={(e) => setSelectedBranch(e.target.value)}
                value={selectedBranch}
                className="p-2 px-4 border rounded-2xl border-neutral-300 bg-white outline-none text-sm sm:text-base w-full sm:w-52"
              >
                <option value={""}>All Branch</option>
                {branch.map((item, index) => (
                  <option key={index} value={item._id}>
                    {item.branch_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
    }
  };

  return <div className="p-2 sm:p-3 md:p-4">{getContent()}</div>;
}

export default Breadcrumb;
