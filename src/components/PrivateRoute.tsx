import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useUserStore from "../store/useUserStore";

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const {isLoggedIn} = useUserStore();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/auth");
    }
  }, [navigate]);

  return children;
};

export default PrivateRoute;
