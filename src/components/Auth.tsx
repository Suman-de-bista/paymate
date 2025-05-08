import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { createNewUser, loginUser } from "../apis/auth";
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/useUserStore";

const Auth = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const {login} = useUserStore()

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let res;
    if (isLogin) {
      res = await loginUser(email, password);
    } else {
      if (password != confirmPassword) {
        console.log("Confirm Password Did not Matched");
        return;
      }
      res = await createNewUser(username, email, password);
    }
    if (res) {
      localStorage.setItem("token", res.token);
      console.log(res);
      login({name:res.name,email:res.email})
      navigate("/");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <h2 className="text-center text-xl font-semibold text-gray-700 mb-6">
        {isLogin ? "Sign in to your account" : "Create a new account"}
      </h2>

      <div className="flex justify-center mb-6">
        <div className="flex rounded-md overflow-hidden border border-gray-300">
          <button
            className={`px-4 py-2 ${
              isLogin ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`px-4 py-2 ${
              !isLogin ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>
      </div>

      <div>
        {!isLogin && (
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        )}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-medium mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-medium mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <div className="relative">
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <EyeOff size={18} className="text-gray-500" />
              ) : (
                <Eye size={18} className="text-gray-500" />
              )}
            </button>
          </div>
        </div>
        {isLogin && (
          <div className="mb-6 text-right">
            <button className="text-sm font-medium text-blue-500 hover:text-blue-700">
              Forgot password?
            </button>
          </div>
        )}

        {!isLogin && (
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="confirm-password"
            >
              Confirm Password
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        )}
        <div className="mb-6">
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
            onClick={handleSubmit}
          >
            {isLogin ? "Sign In" : "Create Account"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Auth;
