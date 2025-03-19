import { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { login } from '../../api/auth/admin'

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [passwordErr, setPasswordErr] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  useEffect(()=>{
    if (localStorage.getItem('adminLoggedIn') == "true") {
      navigate("/admin/dashboard");
      return
    }
    
  },[navigate])

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setEmail(value);

    if (!value) {
      setEmailError('Email is required');
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError(null);
    }
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setPassword(value);

    if (!value) {
      setPasswordErr("Password is required");
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)) {
      setPasswordErr("Password must be at least 8 characters long and include uppercase, lowercase, number & special character");
    } else {
      setPasswordErr(null);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async () => {
    setEmailError('');
    setPasswordErr('');

    if (!email.trim()) {
      setEmailError('Email is required');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
    }

    if (!password.trim()) {
      setPasswordErr('Password is required');
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
      setPasswordErr("Password must be at least 8 characters long and include uppercase, lowercase, number & special character");
    }

    if (email && password) {
      if (emailError || passwordErr) {
        return
      }
      setLoading(true)
      try {
        // Proceed with the login request if no errors
        const response = await login(email, password);


        setLoading(false)
        

        if (response && response.message) {
          localStorage.setItem('adminLoggedIn',"true")
          navigate("/admin/dashboard");
        }
      } catch (err: unknown) {

        setTimeout(() => {
          setLoading(false)
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('An unexpected error occurred');
          }

        }, 1000)
      }
    }
  };

  return (
    <div className="bg-[#0E1220] min-h-screen flex items-center justify-center p-4">
      <div className="bg-[#1A2036] rounded-lg p-8 w-full max-w-md shadow-lg border border-[#2C3347]/50">
        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-6 text-center text-sm">
            {error}
          </div>
        )}

        <h2 className="text-white text-2xl font-semibold mb-6 text-center">
          Admin Login
        </h2>

        {/* Email Input */}
        <div className="mb-6">
          <label className="block text-gray-300 text-sm mb-2">Email Address</label>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={handleEmailChange}
            className="w-full px-4 py-3 rounded-lg bg-[#252B3F] text-white 
            border border-[#3A4255]/50 
            focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50
            transition duration-200 ease-in-out 
            placeholder-gray-500"
          />
          {emailError && (
            <p className="text-red-400 text-xs mt-2 pl-2">{emailError}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label className="block text-gray-300 text-sm mb-2">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={handlePassword}
              className="w-full px-4 py-3 rounded-lg bg-[#252B3F] text-white 
              border border-[#3A4255]/50 
              focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50
              transition duration-200 ease-in-out 
              placeholder-gray-500 pr-12"
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 
              text-gray-400 hover:text-white 
              transition duration-200"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>
          {passwordErr && (
            <p className="text-red-400 text-xs mt-2 pl-2">{passwordErr}</p>
          )}
        </div>

        {/* Login Button */}
        <div className="w-full">
          {loading ? (
            <div className="w-full flex justify-center">
              <Loader />
            </div>
          ) : (
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 
              text-white font-semibold py-3 rounded-lg 
              transition duration-200 ease-in-out 
              focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              onClick={handleSubmit}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
