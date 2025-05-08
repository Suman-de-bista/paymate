import { CreditCard, DollarSign, LogOut, PieChart, Settings, Users, X } from "lucide-react";
import SideBarLink from "./SideBarLink";

const SideBar = ({ isOpen, toggleSidebar }) => {
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
            <SideBarLink icon={<PieChart size={20} />} label="Dashboard" active />
            <SideBarLink icon={<CreditCard size={20} />} label="Expenses" />
            <SideBarLink icon={<Users size={20} />} label="Groups" />
            <SideBarLink icon={<Settings size={20} />} label="Settings" />
  
            <div className="px-4 py-2 mt-12">
              <div className="border-t border-gray-700 pt-4">
                <SideBarLink icon={<LogOut size={20} />} label="Logout" />
              </div>
            </div>
          </nav>
        </aside>
      </>
    );
  };

export default SideBar