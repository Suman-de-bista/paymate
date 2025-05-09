import { Bell, DollarSign, Menu } from "lucide-react";
import { useState } from "react";
import useUserStore from "../../store/useUserStore";

const NavBar = ({ toggleSidebar }) => {
  const [notifications, setNotifications] = useState(0);
  const { user } = useUserStore()

  return (
    <nav className="bg-white shadow-md py-3 px-6 flex justify-between items-center">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="mr-4 lg:hidden text-gray-700 hover:text-blue-500"
        >
          <Menu size={24} />
        </button>
        <div className="flex items-center">
          <div className="bg-blue-500 p-1 rounded-full">
            <DollarSign size={22} className="text-white" />
          </div>
          <h1 className="ml-2 text-xl font-bold text-gray-800">PayMate</h1>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <button className="text-gray-600 hover:text-blue-500">
            <Bell size={20} />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center">
           {/* <img
              src="/api/placeholder/32/32"
              alt="User avatar"
              className="h-8 w-8 rounded-full object-cover border-2 border-blue-500"
            />  */}
            <div
          className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-xs"
        >
          {user?.name.substring(0, 1).toUpperCase()}
        </div>
          

          <span className="ml-2 font-medium text-gray-700 hidden md:block">
            {user?.name || "User"}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default NavBar