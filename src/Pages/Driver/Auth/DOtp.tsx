import { useEffect, useRef, useState } from "react";
import { sendOTP , reSendOTP } from "../../../api/auth/driver";
import { useNavigate } from "react-router-dom";
import LabelStepper from "../../../components/user/Stepper";
import AuthBtn from "../../../components/user/AuthBtn";
import Loader from "../../../components/Loader";
import { useSignup } from "../../../hooks/useSignup";

const DOtp = () => {
  const [otp, setOtp] = useState<string>("");
  const [otpError, setError] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [resendMessage, setResendMessage] = useState<string>("");
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {completeStep} = useSignup()

  // First useEffect: Handle OTP expiration and timer initialization
  useEffect(() => {
    const email = localStorage.getItem("D-email");
    if (!email) {
      navigate("/driver/signup");
      return;
    }

    const storedExpiration = parseInt(localStorage.getItem("otpExpiration") || "0", 10);
    const currentTime = Date.now();

    if (storedExpiration > currentTime) {
      // OTP is still valid, calculate remaining time
      const remainingTime = Math.floor((storedExpiration - currentTime) / 1000);
      setTimeLeft(remainingTime);
      setIsRunning(true);
    } else if (localStorage.getItem('first') == 'true') {
      const currentTime = Date.now();
      localStorage.setItem("otpExpiration", (currentTime + 60000).toString());

      // Reset the timer
      setTimeLeft(60); // Reset to 60 seconds
      setIsRunning(true);
      localStorage.removeItem('first')
    }  else {
      // OTP has expired, do not reset the timer
      setTimeLeft(0); // Set timeLeft to 0
      setIsRunning(false); // Stop the timer
    }
  }, [navigate]);


  
  // Second useEffect: Timer countdown logic
  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;

    if (isRunning && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft((prev) => {
          const newTimeLeft = prev - 1;
          if (newTimeLeft <= 0) {
            setIsRunning(false); // Stop the timer when timeLeft reaches 0
          }
          return newTimeLeft;
        });
      }, 1000);
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isRunning, timeLeft]);

  // Focus the first input field on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Handle OTP input changes
  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return; // Allow only one digit or empty string

    const newOtp = otp.substring(0, index) + value + otp.substring(index + 1);
    setOtp(newOtp);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle backspace key for OTP inputs
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    if (otp.length < 4) {
      setError("Please enter the 4 digits");
      return;
    }
    try {
      setLoading(true);
      setError('')
      setResendMessage('')
      const response = await sendOTP(otp);
      if (response) {
        completeStep(3)
        localStorage.removeItem('otpExpiration')
        setTimeout(() => {
          setLoading(false);
          navigate("/driver/addInfo");
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
  };

  // Resend OTP
  const handleResend = async () => {
    try {
      setLoading(true);
      const response = await reSendOTP(); // Call API to resend OTP
      if (response) {
        setLoading(false);
        setResendMessage(response.message);
        setError(""); // Clear any previous errors

        // Update localStorage with new expiration time
        const currentTime = Date.now();
        localStorage.setItem("otpExpiration", (currentTime + 60000).toString());

        // Reset the timer
        setTimeLeft(60); // Reset to 60 seconds
        setIsRunning(true); // Restart the timer
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
  };

  // Format time for display
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-[#FFFBFB] rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl mx-4 sm:mx-auto">
        <h1 className="font-primary text-4xl">NexaDrive</h1>
        <LabelStepper count={1} step={4} />
        {resendMessage && <p className="text-green-500 mt-4 text-xs">{resendMessage}</p>}
        <div className="mt-8 px-3 block items-center">
          <p className="font-semibold text-m">Let’s secure your account</p>
          <p className="text-xs">
            We sent a code to the email address you gave us. Please enter the 4-digit code in that email.
          </p>
          <div className="mt-10 flex gap-4 justify-center mb-5">
            {Array.from({ length: 4 }).map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-md shadow-inner shadow-gray-500/80  focus:outline-none   focus:border-blue-500"
                ref={(el) => (inputRefs.current[index] = el!)}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                value={otp[index] || ""}
              />
            ))}
          </div>
          {otpError && <p className="text-red-500 text-xs">{otpError}</p>}
          {loading ? (
            <Loader />
          ) : (
            <AuthBtn text={"Verify"} onClick={handleSubmit} />
          )}
        </div>
        {isRunning ? (
          <p className="text-xs mt-6">
            Time remaining: <span className="ml-2 font-bold">{formatTime(timeLeft)}</span>
          </p>
        ) : (
          <p className="text-xs mt-6">
            Didn't get the OTP?{" "}
            <span
              onClick={handleResend}
              className="text-blue-500 underline hover:cursor-pointer hover:font-semibold"
            >
              Resend
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default DOtp;