import axios from "axios";
import { BASE_URL } from "../../components/Constants";

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/login`,
      { email, password },
      { withCredentials: true }
    );
    return response.data;
  } catch (err: any) {
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
    return response.data;
  } catch (err: any) {
    console.log(err.response?.data || err.message);
    throw err.response?.data?.detail || "Signup failed";
  }
};
