import { DollarSign } from "lucide-react";
import Auth from "../components/Auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/useUserStore";
const AuthPage = () => {
  const navigate = useNavigate();
  const {isLoggedIn} = useUserStore();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      {!isLoggedIn && (
        <div className="w-full max-w-md px-8 pt-6 pb-8 mb-4 bg-white rounded-lg shadow-xl">
        <div className="flex justify-center mb-6">
          <div className="flex items-center">
            <div className="bg-blue-500 p-2 rounded-full">
              <DollarSign size={28} className="text-white" />
            </div>
            <h1 className="ml-2 text-2xl font-bold text-gray-800">PayMate</h1>
          </div>
        </div>
        <Auth />
      </div>
      )}
      
    </div>
  );
};

export default AuthPage;
