import AuthInput from "../../../Components/User Comp/AuthInput"
import AuthBtn from "../../../Components/User Comp/AuthBtn"
import { FaGoogle } from "react-icons/fa";
import { motion } from "framer-motion";

const Signup = () => {
    return (
        <div className="flex items-center justify-center min-h-screen ">
            <div className="bg-[#FFFBFB]  rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl mx-4 sm:mx-auto ">
                <h1 className="font-primary text-4xl">NexaRide</h1>

                <div className="mt-20 px-3 block items-center">
                    <AuthInput type={"email"} placeholder={"Enter your e-mail address"} />

                    <AuthBtn text={"Verify"} />

                    <p className="lg:mr-5 mt-4">or</p>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }} 
                      className="w-full sm:max-w-xs h-12 mt-3 mb-3 border-2 border-gray-400 rounded-3xl flex justify-center items-center gap-3 text-sm hover:bg-black hover:text-white transition-all" >
                        <FaGoogle />
                        Login with google 
                    </ motion.div>

                </div>

                <p className="text-xs mt-6 mr-43 ">Already an user ? <span className="text-blue-500 underline hover:cursor-pointer hover:font-semibold ">Login </span></p>
            </div>
        </div>
    )
}

export default Signup
