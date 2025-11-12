import React from "react";
import { Link, useLocation } from "react-router-dom";

//Importing icon
import { House, User } from "lucide-react";
import { LayoutDashboard } from "lucide-react";
import { Building2 } from "lucide-react";
import { Users } from "lucide-react";
import { IdCardLanyard } from "lucide-react";
import { ShieldUser } from "lucide-react";
import { Coins } from "lucide-react";
import { Wallet } from "lucide-react";
import { Box } from "lucide-react";
import { BookText } from "lucide-react";
import { HandCoins } from "lucide-react";
import { ArrowLeftRight } from "lucide-react";

const adminRoutes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    link: "/admin",
  },
  {
    label: "Branches",
    icon: Building2,
    link: "/admin/branches",
  },
  {
    label: "Customers",
    icon: Users,
    link: "/admin/customers",
  },
  {
    label: "Employees",
    icon: IdCardLanyard,
    link: "/admin/employees",
  },
  {
    label: "Account Managers",
    icon: ShieldUser,
    link: "/admin/accountmanagers",
  },
  {
    label: "Rents",
    icon: Coins,
    link: "/admin/rents",
  },
  {
    label: "Salary",
    icon: Wallet,
    link: "/admin/salary",
  },
  {
    label: "Inventory",
    icon: Box,
    link: "/admin/inventory",
  },
  {
    label: "Monthly Bills",
    icon: BookText,
    link: "/admin/monthlybill",
  },
  {
    label: "Cashout",
    icon: HandCoins,
    link: "/admin/cashout",
  },
  {
    label: "Transactions",
    icon: ArrowLeftRight,
    link: "/admin/transactions",
  },
];

let accountRoutes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    link: "/account",
  },
  {
    label: "Branches",
    icon: Building2,
    link: "/account/branches",
  },
  {
    label: "Customers",
    icon: Users,
    link: "/account/customers",
  },
  {
    label: "Employees",
    icon: IdCardLanyard,
    link: "/account/employees",
  },
  {
    label: "Rents",
    icon: Coins,
    link: "/account/rents",
  },
  {
    label: "Salary",
    icon: Wallet,
    link: "/account/salary",
  },
  {
    label: "Inventory",
    icon: Box,
    link: "/account/inventory",
  },
  {
    label: "Monthly Bills",
    icon: BookText,
    link: "/account/monthlybill",
  },
  {
    label: "Transactions",
    icon: ArrowLeftRight,
    link: "/account/transactions",
  },
];

function SideBar({ showSideBar, setShowSideBar, type }) {
  const location = useLocation();

  const isActive = (label) => {
    if (
      (location.pathname === "/admin" || location.pathname === "/account") &&
      label === "Dashboard"
    )
      return true;
    if (location.pathname.includes(label.toLowerCase())) return true;
    if (
      location.pathname.includes("accountmanagers") &&
      label === "Account Managers"
    )
      return true;
    if (location.pathname.includes("monthlybill") && label === "Monthly Bills")
      return true;

    return false;
  };

  const handleLinkClick = () => {
    // Close sidebar on mobile when a link is clicked
    if (setShowSideBar) {
      // Use media query to check if we're on mobile
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      if (isMobile) {
        setShowSideBar(false);
      }
    }
  };

  const handleBackdropClick = () => {
    if (setShowSideBar) {
      setShowSideBar(false);
    }
  };

  let routes = type === 'account' ? accountRoutes : adminRoutes

  return (
    <>
      {/* Backdrop overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/40 z-30 md:hidden transition-opacity duration-300 ease-in-out ${
          showSideBar ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleBackdropClick}
        aria-hidden="true"
      ></div>
      
      {/* Sidebar */}
      <div
        className={`w-72 md:w-64 bg-white border-r border-neutral-200 fixed top-0 ${
          showSideBar ? "left-0" : "-left-72"
        } md:left-0 bottom-0 z-40 md:z-20 transition-[left] duration-300 ease-out overflow-y-auto`}
      >
        {/* Logo */}
        <div className="h-14 sm:h-16 w-full flex justify-center gap-2 items-center px-2 sm:px-4 border-b border-neutral-200">
          <div className="bg-blue-500 rounded-md flex justify-center items-center p-1.5 sm:p-2">
            <House size={16} className="sm:w-5 sm:h-5 text-white"></House>
          </div>
          <h1 className="text-lg sm:text-xl font-semibold">PgPanel</h1>
        </div>
        
        {/* Links */}
        <div className="flex flex-col p-3 sm:p-4 md:p-6 gap-2 sm:gap-3 md:gap-4">
          {routes.map(
            ({ link, label, icon: Icon }, index) => (
              <Link
                key={index}
                to={link}
                onClick={handleLinkClick}
                className={`group flex p-2 sm:p-2.5 items-center hover:bg-blue-100 gap-2 sm:gap-3 ${
                  isActive(label) && "bg-blue-100"
                } rounded-md transition-colors duration-200`}
              >
                <Icon
                  className={`flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 ${
                    isActive(label) && "text-blue-500"
                  } group-hover:text-blue-500 transition-colors`}
                ></Icon>
                <span
                  className={`text-sm sm:text-base ${
                    isActive(label) ? "text-blue-500" : "text-black"
                  } group-hover:text-blue-500 font-medium transition-colors`}
                >
                  {label}
                </span>
              </Link>
            )
          )}
        </div>
      </div>
    </>
  );
}

export default SideBar;
