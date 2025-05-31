import { CreditCard, DollarSign, LogOut, PieChart, Settings, Users, X } from "lucide-react";
import SideBarLink from "./SideBarLink";
import useUserStore from "../../store/useUserStore";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SideBar = ({ isOpen, toggleSidebar }) => {
  const {logout} = useUserStore()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    localStorage.removeItem("token");
    logout()
    toast.success("Logged out successfully")
    navigate("/auth")
  }
    return (
      <>
        {/* Mobile overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={toggleSidebar}
          ></div>
        )}
  
        <aside
          className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 transform transition-transform duration-300 ease-in-out z-30 ${
            isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center">
              <div className="bg-blue-500 p-1 rounded-full">
                <DollarSign size={22} className="text-white" />
              </div>
              <h2 className="ml-2 text-xl font-bold">PayMate</h2>
            </div>
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
  
          <nav className="mt-6">
            <SideBarLink handleClick={() => navigate("/dashboard")} icon={<PieChart size={20} />} label="Dashboard" active={location.pathname === "/dashboard"} />
            {/* <SideBarLink handleClick={() => navigate("/expenses")} icon={<CreditCard size={20} />} label="Expenses" active={location.pathname === "/expenses"} /> */}
            <SideBarLink handleClick={() => navigate("/groups")} icon={<Users size={20} />} label="Groups" active={location.pathname === "/groups"} />
            <SideBarLink handleClick={() => navigate("/settings")} icon={<Settings size={20} />} label="Settings" active={location.pathname === "/settings"} />
  
            <div className="px-4 py-2 mt-12">
              <div className="border-t border-gray-700 pt-4">
                <SideBarLink handleClick={handleLogout} icon={<LogOut size={20} />} label="Logout" />
              </div>
            </div>
          </nav>
        </aside>
      </>
    );
  };

export default SideBar