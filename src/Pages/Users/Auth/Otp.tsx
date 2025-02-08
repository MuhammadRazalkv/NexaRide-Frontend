import AuthBtn from "../../../Components/User Comp/AuthBtn"
import { useRef } from "react";

const Otp = () => {
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (!/^\d?$/.test(value)) return; // Allow only one digit

        e.target.value = value.slice(-1); // Ensure only one digit stays

        // Move to next input if a digit is entered
        if (value && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Move to previous input on Backspace if current is empty
        if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };
    return (
        <div className="flex items-center justify-center min-h-screen ">
          <div className="bg-[#FFFBFB] rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl mx-4 sm:mx-auto">

                <h1 className="font-primary text-4xl">NexaRide</h1>

                <div className="mt-20 px-3 block  items-center">

                    <p className="font-semibold text-m">Let’s secure your account
                    </p>
                    <p className="text-xs">
                        We sent a code to the email address you gave us. Please enter the 4 digit code in that email.
                    </p>



                    <div className="mt-10 flex gap-4 justify-center mb-5">
                        {Array(4).fill(0).map((_, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength={1}
                                className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-md shadow-inner shadow-gray-500/80 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                ref={(el) => (inputRefs.current[index] = el)}
                                onChange={(e) => handleChange(index, e)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                            />
                        ))}
                    </div>
                    <AuthBtn text={'Verify'} />

                </div>

                <p className="text-xs mt-6 mr-30 ">Did'nt get the OTP ? <span className="text-blue-500 underline hover:cursor-pointer hover:font-semibold ">Resend</span></p>
            </div>
        </div>
    )
}

export default Otp
