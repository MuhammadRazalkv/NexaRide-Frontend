import React, {  forwardRef, } from "react";

interface InputFieldProps {
  type: string;
  placeholder?: string;
  value?: string | number;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | null;
}


const AuthInput = forwardRef<HTMLInputElement, InputFieldProps>(  
  ({ type, placeholder, value, onChange, error, className }, ref) => {
    return (
      <div>
        <input
          ref={ref} 
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={` ${className} w-full  h-11 mt-3 mb-3 shadow-inner shadow-gray-500/80 p-4 rounded-3xl bg-[#EEEDED] placeholder:text-xs border border-gray-300 focus:border-blue-500 focus:outline-none text-sm`}
        />
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </div>
    );
  }
);

export default AuthInput;