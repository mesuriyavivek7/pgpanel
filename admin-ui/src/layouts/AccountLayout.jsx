import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";

function AccountLayout() {
  return (
    <div className="flex">
        <SideBar type='account'></SideBar>
        <main className="flex grow p-4">
            <Outlet></Outlet>
        </main>
    </div>
  )
}

export default AccountLayout