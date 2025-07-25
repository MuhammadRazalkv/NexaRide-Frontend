import AuthInput from "../../../components/user/AuthInput";
import AuthBtn from "../../../components/user/AuthBtn";
import { FaGoogle } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { verifyEmail, checkGoogleAuth } from "../../../api/auth/driver";
import { useNavigate, Link } from "react-router-dom";
import LabelStepper from "../../../components/user/Stepper";
import { useGoogleLogin } from "@react-oauth/google";
import { useSignup } from "../../../hooks/useSignup";
import axios from "axios";

const DSignup = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const { completeStep } = useSignup();
  // const {completeStep , setGoogleAuth} = useSignup()

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (!value) {
      setEmailError("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError(null);
    }
  };

  const handleSubmit = async () => {
    if (!email) {
      setEmailError("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError(null);
      try {
        const response = await verifyEmail(email);
        if (response) {
          localStorage.setItem("D-email", email);
          localStorage.setItem("first", "true");
          completeStep(2);
          navigate("/driver/otp-verify");
        }
      } catch (error) {
        if (error instanceof Error) {
          setEmailError(error.message);
        } else {
          setEmailError("An unexpected error occurred");
        }
      }
    }
  };

  // //! Google
  const signUp = useGoogleLogin({
    onSuccess: async (response) => {
      console.log("Access Token:", response.access_token);

      // Fetch user details from Google API
      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: { Authorization: `Bearer ${response.access_token}` },
        }
      );

      console.log("User Info:", userInfo.data);
      const userSerializable = {
        id: userInfo?.data?.id,
        email: userInfo?.data?.email,
        name: userInfo?.data?.name,
        picture: userInfo?.data?.picture,
      };
      const existingDriver = await checkGoogleAuth(
        userSerializable.id,
        userSerializable.email
      );
      if (existingDriver.success) {
        setEmailError(
          existingDriver.message ||
            "Email already registered. Please log in instead."
        );
        return;
      }
      localStorage.setItem("D-email", userSerializable.email);
      completeStep(3);
      navigate("/driver/addInfo", { state: userSerializable });
    },
    onError: (error) => {
      console.error("Login Failed:", error);
      setEmailError(error.error_description || "Google authentication failed ");
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="bg-[#FFFBFB] rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl mx-4 sm:mx-auto ">
        <h1 className="font-primary text-4xl">NexaDrive</h1>

        <LabelStepper count={0} step={4} />

        <div className="mt-15 px-3 block items-center">
          <AuthInput
            ref={inputRef}
            type="email"
            placeholder="Enter your e-mail address"
            value={email}
            onChange={handleEmailChange}
            error={emailError}
          />

          <AuthBtn text={"Verify"} onClick={() => handleSubmit()} />

          <p className="lg:mr-5 text-sm mt-4">or</p>

          {/* Google auth  */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:max-w-xs h-12 mt-3 mb-3 border-2 border-gray-400 rounded-3xl flex justify-center items-center gap-3 text-xs hover:bg-black hover:text-white transition-all"
            onClick={() => signUp()}
          >
            <FaGoogle />
            Signup with google
          </motion.div>
        </div>

        <p className="text-xs mt-6 mr-35 ">
          Already have an account?{" "}
          <span className="text-blue-500 underline hover:cursor-pointer hover:font-semibold ">
            {" "}
            <Link to={"/driver/login"}> Login </Link>{" "}
          </span>
        </p>
      </div>
    </div>
  );
};

export default DSignup;
