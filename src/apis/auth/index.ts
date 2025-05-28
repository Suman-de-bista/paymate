import axios from "axios";
import { BASE_URL } from "../../components/Constants";
import toast from "react-hot-toast";

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/login`,
      { email, password },
      { withCredentials: true }
    );
    toast.success("Login successful");
    return response.data;
  } catch (err: any) {
    toast.error(err.response?.data?.detail || "Login failed");
    console.log(err.response?.data || err.message);
    throw err.response?.data?.detail || "Login failed";
  }
};

export const createNewUser = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/signup`,
      { name: username, email, password },
      { withCredentials: true }
    );
    toast.success("Signup successful");
    return response.data;
  } catch (err: any) {
    toast.error(err.response?.data?.detail || "Signup failed");
    console.log(err.response?.data || err.message);
    throw err.response?.data?.detail || "Signup failed";
  }
};
