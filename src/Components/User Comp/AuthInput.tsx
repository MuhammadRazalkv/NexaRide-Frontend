import { FC } from "react"

interface InputFieldProps {
    type: string  ;
    placeholder: string;
    // register: UseFormRegisterReturn; // Gets register from parent
    error?: string; // For showing validation errors
  }
  

const AuthInput : FC<InputFieldProps> = ({ type , placeholder , error}) => {
  return (
    <div >
      <input type={type} placeholder={placeholder}
       className="w-full sm:max-w-xs h-12 mt-3 mb-3 shadow-inner shadow-gray-500/80 p-4 rounded-3xl bg-[#EEEDED] placeholder:text-xs focus:outline-none" />
      {error && <p className="text-red-500">{error}</p>}
    </div>
  )
}

export default AuthInput
