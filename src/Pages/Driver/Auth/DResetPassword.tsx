import { useEffect, useState } from "react";
import AuthBtn from "../../../components/user/AuthBtn";
import AuthInput from "../../../components/user/AuthInput";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../../api/auth/driver";
import Loader from "../../../components/Loader";

const DResetPassword = () => {
  const [searchParams] = useSearchParams();

  const id = searchParams.get("id");
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [passwordErr, setPasswordErr] = useState<string | null>(null);

  const [cPassword, setCpassword] = useState("");
  const [cPasswordErr, setCpasswordErr] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!id || !token) {
      navigate("/driver/login");
    }
  }, [id, token, navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const toggleCPasswordVisibility = () => {
    setShowCPassword((prev) => !prev);
  };

  // Password Validation
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

  // Confirm Password Validation
  const handleCpassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setCpassword(value);

    if (!value.trim()) {
      setCpasswordErr("Confirm Password is required");
    } else if (value !== password) {
      setCpasswordErr("Passwords do not match");
    } else {
      setCpasswordErr(null);
    }
  };

  const handleSubmit = async () => {
    if (!passwordErr && !cPasswordErr && password && cPassword) {
      setCpasswordErr(null);
      setPasswordErr(null);

      try {
        setLoading(true);
        if (!id) {
          throw new Error("Id is missing ");
        }
        if (!token) {
          throw new Error("Token is missing ");
        }
        // setLoading(true)

        const response = await resetPassword(id, token, password);
        if (response) {
          setLoading(false);
          setSuccess(response.message + "redirecting to login");
          setTimeout(() => {
            navigate("/driver/login");
          }, 1000);
        }
      } catch (err: unknown) {
        setTimeout(() => {
          setLoading(false);
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("An unexpected error occurred");
          }
        }, 1000);
      }
    } else {
      return;
    }
  };

  return (
    <div className="flex items-center justify-center h-screen overflow-hidden">
      <div className="bg-[#FFFBFB] rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl mx-4 sm:mx-auto">
        <h1 className="font-primary text-4xl">NexaDrive</h1>
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

        {success && <p className="text-green-500 text-xs mt-2">{success}</p>}

        <div className="mt-10">
          <div className="relative">
            <AuthInput
              type={showPassword ? "text" : "password"}
              placeholder="Enter your new password"
              onChange={handlePassword}
              value={password}
              error={passwordErr}
              className="pr-10" // Adds right padding to prevent overlap
            />
            <button
              type="button"
              className={` absolute right-5 ${
                passwordErr ? "top-[36%] " : "top-[50%]"
              }  translate-y-[-50%] text-gray-600  `}
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="relative">
            <AuthInput
              type={showCPassword ? "text" : "password"}
              placeholder="Confirm your password"
              onChange={handleCpassword}
              value={cPassword}
              error={cPasswordErr}
            />
            <button
              type="button"
              className={` absolute right-5 ${
                cPasswordErr ? "top-[36%] " : "top-[50%]"
              }  translate-y-[-50%] text-gray-600  `}
              onClick={toggleCPasswordVisibility}
            >
              {showCPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <AuthBtn text={"Change password"} onClick={handleSubmit} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DResetPassword;
