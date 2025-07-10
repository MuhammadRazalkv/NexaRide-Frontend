import AuthBtn from "../../../components/user/AuthBtn";
import AuthInput from "../../../components/user/AuthInput";
import { motion } from "framer-motion";
import { FaGoogle } from "react-icons/fa";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { login, loginWithGoogle, forgotPass } from "../../../api/auth/user";
import { sLogin } from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";


const Login = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [passwordErr, setPasswordErr] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setEmail(value);

    if (!value) {
      setEmailError("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError(null);
    }
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setPassword(value);

    if (!value.trim()) {
      setPasswordErr("Password is required");
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        value
      )
    ) {
      setPasswordErr(
        "Password must be at least 8 characters long and include uppercase, lowercase, number & special character"
      );
    } else {
      setPasswordErr(null);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async () => {
    // Reset errors before validation
    setEmailError("");
    setPasswordErr("");

    // Validate email
    if (!email.trim()) {
      setEmailError("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
    }

    // Validate password
    if (!password.trim()) {
      setPasswordErr("Password is required");
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
      )
    ) {
      setPasswordErr(
        "Password must be at least 8 characters long and include uppercase, lowercase, number & special character"
      );
    }

    if (email && password) {
      setLoading(true);
      try {
        const response = await login(email, password);

        setLoading(false);
        if (response && response.accessToken && response.user) {
          const token = response.accessToken;
          const user = response.user;
          dispatch(sLogin({ user, token }));
          navigate("/user/ride");
        }
      } catch (err: unknown) {
        setLoading(false);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      }
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      // Fetch user details from Google API
      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: { Authorization: `Bearer ${response.access_token}` },
        }
      );

      const userSerializable = {
        googleId: userInfo?.data?.id,
        email: userInfo?.data?.email,
        name: userInfo?.data?.name,
        picture: userInfo?.data?.picture,
      };

      try {
        const res = await loginWithGoogle(userSerializable);
        if (res && res.accessToken && res.user) {
          const token = res.accessToken;
          const user = res.user;
          dispatch(sLogin({ user, token }));
          navigate("/user/ride");
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      }
    },
    onError: (error) => {
      console.error("Login Failed:", error);
      setEmailError(error.error_description || "Google authentication failed ");
    },
  });

  const forgotPassword = async () => {
    if (!email.trim()) {
      setEmailError("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
    }
    if (email && !emailError) {
      setLoading(true);
      try {
        const response = await forgotPass(email);
        if (response) {
          console.log("Response in forgot password", response);

          setSuccess(response.message);
          setLoading(false);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen overflow-hidden">
      <div className="bg-[#FFFBFB] rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl mx-4 sm:mx-auto">
        <h1 className="font-primary text-4xl">NexaRide</h1>
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        {success && <p className="text-green-500 text-xs mt-2">{success}</p>}
        <div className="mt-10">
          <AuthInput
            type={"email"}
            placeholder={"Enter your email address "}
            value={email}
            onChange={handleEmailChange}
            error={emailError}
          />

          <div className="relative">
            <AuthInput
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              onChange={handlePassword}
              value={password}
              error={passwordErr}
              className="pr-10" // Adds right padding to prevent overlap
            />
            <button
              type="button"
              className={`absolute right-5 ${
                passwordErr ? "top-[36%]" : "top-[50%]"
              } translate-y-[-50%] text-gray-600`}
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Forgot password Link  */}
          <p
            className="text-xs text-blue-500 underline ml-49 hover:font-semibold hover:cursor-pointer"
            onClick={forgotPassword}
          >
            Forgot password ?
          </p>
          <div className="">
            
              <AuthBtn text={loading ? 'Verifying...' : 'Login'} onClick={handleSubmit} />
        
          </div>

          <p className="lg:mr-5 text-sm mt-4">or</p>

          <motion.div
            onClick={() => googleLogin()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:max-w-xs h-12 mt-3 mb-3 border-2 border-gray-400 rounded-3xl flex justify-center items-center gap-3 text-sm hover:bg-black hover:text-white transition-all"
          >
            <FaGoogle />
            Login with google
          </motion.div>
        </div>

        <p className="text-xs mt-6 mr-40 sm:mr-32">
          Don't have an account ?{" "}
          <span className="text-blue-500 underline hover:cursor-pointer hover:font-semibold">
            <Link to={"/user/signup"}>Sign up</Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
