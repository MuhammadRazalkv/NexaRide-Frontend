import AuthInput from "../../../Components/User Comp/AuthInput";
import AuthBtn from "../../../Components/User Comp/AuthBtn";
import { FaGoogle } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState, useRef  } from "react";
// import { sendEmail } from "../../../api/auth/user";
import {  Link } from "react-router-dom";
// import { useNavigate , Link } from "react-router-dom";
import LabelStepper from "../../../Components/User Comp/Stepper";
// import { useGoogleLogin } from '@react-oauth/google'
// import axios from "axios";

const DSignup = () => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState<string | null>(null);
    // const navigate = useNavigate()
    const inputRef = useRef<HTMLInputElement>(null);

    // useEffect(() => {
    //     if (inputRef.current) {
    //         inputRef.current.focus();
    //     }
    // }, []);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const value = e.target.value;
        setEmail(value);

        if (!value) {
            setEmailError('Email is required');
        } else if (!/\S+@\S+\.\S+/.test(value)) {
            setEmailError('Please enter a valid email address');
        } else {
            setEmailError(null);
        }
    };

    // const handleSubmit = () => {

    //     if (!email) {
    //         setEmailError('Email is required');
    //     } else if (!/\S+@\S+\.\S+/.test(email)) {
    //         setEmailError('Please enter a valid email address');
    //     } else {

    //         setEmailError(null);
    //         console.log('Form submitted with email:', email);
    //         sendEmail(email).then((value) => {
    //             console.log(value);
    //             localStorage.setItem('email', email)
    //             localStorage.setItem('first','true')
    //             navigate('/user/otp-verify')
    //         }).catch((err) => {
    //             setEmailError(err.message)
    //         })

    //     }
    // };

    // //! Google 
    // const signUp = useGoogleLogin({
    //     onSuccess: async (response) => {
    //         console.log("Access Token:", response.access_token);

    //         // Fetch user details from Google API
    //         const userInfo = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
    //             headers: { Authorization: `Bearer ${response.access_token}` },
    //         });

    //         console.log("User Info:", userInfo.data);
    //         const userSerializable = {
    //             id: userInfo?.data?.id,
    //             email: userInfo?.data?.email,
    //             name: userInfo?.data?.name,
    //             picture: userInfo?.data?.picture,
    //         };
    //         localStorage.setItem('email', userSerializable.email)
    //         // Redirect to addInfo page with Google user details
    //         navigate("/user/addInfo", { state: userSerializable });
    //     },
    //     onError: (error) => {
    //         console.error("Login Failed:", error)
    //         setEmailError(error.error_description||'Google authentication failed ')
    //     },
    // });

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


                    <AuthBtn text={"Verify"} onClick={() => {}} />

                    <p className="lg:mr-5 text-sm mt-4">or</p>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full sm:max-w-xs h-12 mt-3 mb-3 border-2 border-gray-400 rounded-3xl flex justify-center items-center gap-3 text-xs hover:bg-black hover:text-white transition-all"
                        // onClick={() => signUp()}
                    >
                        <FaGoogle />
                        Login with google
                    </motion.div>

                </div>

                <p className="text-xs mt-6 mr-43 ">Already a user? <span className="text-blue-500 underline hover:cursor-pointer hover:font-semibold "> <Link to={'/user/login'}> Login </Link> </span></p>
            </div>
        </div>
    );
};

export default DSignup;
