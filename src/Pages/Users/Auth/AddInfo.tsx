import AuthBtn from "../../../Components/User Comp/AuthBtn"
import AuthInput from "../../../Components/User Comp/AuthInput"
const AddInfo = () => {
    return (
        <div className="flex items-center justify-center min-h-screen ">
            <div className="bg-[#FFFBFB]  rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl mx-4 sm:mx-auto ">
                <h1 className="font-primary text-4xl">NexaRide</h1>
                <div>
                    <div className="mt-10 px-3 block items-center">
                        <AuthInput type={"text"} placeholder={"Enter your name "} />
                        <AuthInput type={"phone"} placeholder={"Enter your phone number "} />
                        <AuthInput type={"password"} placeholder={"Enter your password "} />
                        <AuthInput type={"password"} placeholder={"Confirm your password "} />

                        <AuthBtn text={"Submit"} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddInfo
