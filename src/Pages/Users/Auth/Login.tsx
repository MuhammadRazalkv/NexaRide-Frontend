import AuthBtn from "../../../Components/User Comp/AuthBtn"
import AuthInput from "../../../Components/User Comp/AuthInput"
import { motion } from 'framer-motion'
import { FaGoogle } from "react-icons/fa";

const Login = () => {
    return (
        <div className="flex items-center justify-center min-h-screen ">
            <div className="bg-[#FFFBFB]  rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl mx-4 sm:mx-auto ">
                <h1 className="font-primary text-4xl">NexaRide</h1>

                <div className="mt-10">

                    <AuthInput type={"email"} placeholder={"Enter your email address "} />
                    <AuthInput type={"password"} placeholder={"Enter your password "} />
                    <p className="text-xs text-blue-500 underline ml-49 hover:font-semibold hover:cursor-pointer" >Forgot password ?</p>
                    <AuthBtn text={"Login"} />

                    <p className="lg:mr-5 mt-4">or</p>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full sm:max-w-xs h-12 mt-3 mb-3 border-2 border-gray-400 rounded-3xl flex justify-center items-center gap-3 text-sm hover:bg-black hover:text-white transition-all" >
                        <FaGoogle />
                        Login with google
                    </ motion.div>
                </div>
                <p className="text-xs mt-6 mr-40 sm:mr-32"> 
                Don't have an account ? <span className="text-blue-500 underline hover:cursor-pointer hover:font-semibold ">Sign up </span></p>
            </div>
        </div>
    )
}

export default Login
