import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useUserStore from "../store/useUserStore";

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const {isLoggedIn,logout} = useUserStore();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!isLoggedIn || !token) {
      localStorage.removeItem("token");
      logout()
      navigate("/auth");
    }
  }, [navigate]);

  return children;
};

export default PrivateRoute;
