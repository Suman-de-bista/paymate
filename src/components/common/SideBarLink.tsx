import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/useUserStore";

const SideBarLink = ({ icon, label, active }) => {
  const {logout} = useUserStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token");
    logout()
    navigate("/auth")
  }
    return (
      <button
        className={`flex items-center px-4 py-3 text-sm ${
          active ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"
        }`}
        onClick={handleLogout}
      >
        <span className="mr-3">{icon}</span>
        <span>{label}</span>
      </button>
    );
  };
  

export default SideBarLink