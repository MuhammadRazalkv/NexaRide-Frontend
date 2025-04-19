import AuthBtn from "../../../components/user/AuthBtn";
import AuthInput from "../../../components/user/AuthInput";
import LabelStepper from "../../../components/user/Stepper";
import { useState, useRef, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { addInfo } from "../../../api/auth/user";
import { useNavigate, useLocation } from "react-router-dom";
import { sLogin } from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";
import Loader from "../../../components/Loader";

const AddInfo = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const googleAuthData = location.state
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')
    const [name, setName] = useState("");
    const [nameErr, setNameErr] = useState<string | null>(null);

    const [phone, setPhone] = useState<string>('');
    const [phoneErr, setPhoneErr] = useState<string | null>(null);

    const [password, setPassword] = useState("");
    const [passwordErr, setPasswordErr] = useState<string | null>(null);

    const [cPassword, setCpassword] = useState("");
    const [cPasswordErr, setCpasswordErr] = useState<string | null>(null);

    const [error, setError] = useState('')

    const [showPassword, setShowPassword] = useState(false)
    const [showCPassword, setShowCPassword] = useState(false)

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const email = localStorage.getItem('email')
        if (email == null) {
            navigate('/user/signup')
        }
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [navigate]);

    useEffect(() => {
        if (googleAuthData && googleAuthData.name) {
            setName(googleAuthData.name)
        }

    }, [googleAuthData])

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    }
    const toggleCPasswordVisibility = () => {
        setShowCPassword((prev) => !prev);
    }


    // Name Validation
    const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setName(value);

        if (!value.trim()) {
            setNameErr("Name is required");
        } else if (!/^[A-Za-z\s]{3,}$/.test(value)) {
            setNameErr("Name must be at least 3 characters and contain only alphabets & spaces");
        } else {
            setNameErr(null);
        }
    };

    // Phone Number Validation
    const handlePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim()
        setPhone(value);

        if (!value.trim()) {
            setPhoneErr("Phone number is required");
        } else if (!/^[6-9]\d{9}$/.test(value)) {
            setPhoneErr("Enter a valid phone number");
        } else {
            setPhoneErr('');
        }
    };

    // Password Validation
    const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim()
        setPassword(value);

        if (!value.trim()) {
            setPasswordErr("Password is required");
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)) {
            setPasswordErr("Password must be at least 8 characters long and include uppercase, lowercase, number & special character");
        } else {
            setPasswordErr(null);
        }
    };

    // Confirm Password Validation
    const handleCpassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim()
        setCpassword(value);

        if (!value.trim()) {
            setCpasswordErr("Confirm Password is required");
        } else if (value !== password) {
            setCpasswordErr("Passwords do not match");
        } else {
            setCpasswordErr(null);
        }
    };

    // Form Submission
    const handleSubmit = async () => {
        if (!nameErr && !phoneErr && !passwordErr && !cPasswordErr && name && phone && password && cPassword) {
            setNameErr(null)
            setPhoneErr(null)
            setCpasswordErr(null)
            setPasswordErr(null)

            try {
                setLoading(true)
                const googleID = googleAuthData ? googleAuthData.id : ""
                const profilePic = googleAuthData ? googleAuthData.picture : ""


                const response = await addInfo(name, phone, password, googleID, profilePic);
                if (response && response.accessToken && response.user) {
                    setTimeout(() => {
                        setLoading(false)
                        setSuccess(response.message || 'User created successfully')
                        const token = response.accessToken;
                        const user = response.user
                        dispatch(sLogin({ user, token }))
                        localStorage.removeItem("email");
                        navigate("/user/ride");
                    }, 1000);
                }
            } catch (err: unknown) {
                setTimeout(() => {
                    setLoading(false)
                    if (err instanceof Error) {
                        setError(err.message)
                    } else {
                        setError('An unexpected error occurred')
                    }
                }, 1000)
            }
        } else {
            return
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-[#FFFBFB] rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl mx-4 sm:mx-auto">
                <h1 className="font-primary text-4xl">NexaRide</h1>
                <LabelStepper count={2} step={3} />
                {success && <p className="text-green-500 text-xs mt-2">{success}</p>}
                {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
                <div>
                    <div className="mt-10 px-3 block items-center">
                        <AuthInput
                            ref={inputRef}
                            type="text"
                            placeholder="Enter your name"
                            onChange={handleName}
                            value={name}
                            error={nameErr}
                        />
                        <AuthInput
                            type="number"
                            placeholder="Enter your phone number"
                            onChange={handlePhone}
                            value={phone}
                            error={phoneErr}
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

                                className={` absolute right-5 ${passwordErr ? 'top-[36%] ' : 'top-[50%]'}  translate-y-[-50%] text-gray-600  `}
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

                                className={` absolute right-5 ${cPasswordErr ? 'top-[36%] ' : 'top-[50%]'}  translate-y-[-50%] text-gray-600  `}
                                onClick={toggleCPasswordVisibility}
                            >
                                {showCPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {
                            loading ?
                                <Loader />
                                :
                                <AuthBtn text="Submit" onClick={handleSubmit} />
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddInfo;
