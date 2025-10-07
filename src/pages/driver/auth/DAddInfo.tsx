import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import LabelStepper from "../../../components/user/Stepper";
import { addInfo } from "../../../api/auth/driver";
import { useNavigate, useLocation } from "react-router-dom";
import { useSignup } from "../../../hooks/useSignup";
import { driverSchema } from "@/utils/validations/driverValidation";

export type FormData = yup.InferType<typeof driverSchema>;

const DAddInfo = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(driverSchema),
  });

  const { completeStep } = useSignup();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const googleAuthData = location.state;
  const onSubmit = async (data: FormData) => {
    console.log("Form Data: ", data);
    const googleID = googleAuthData ? googleAuthData.id : "";
    const profilePic = googleAuthData ? googleAuthData.picture : "";
    const updatedData = {
      name: `${data.firstName.trim()} ${data.lastName.trimEnd()}`,
      email: localStorage.getItem("D-email") || "",
      password: data.password,
      phone: data.phone,
      license_number: data.licenseNumber.toUpperCase(),
      street: data.street,
      city: data.city,
      state: data.state,
      pin_code: data.zip,
      dob: data.dob,
      license_exp: data.expirationDate,
      googleId: googleID,
      profilePic: profilePic,
    };

    try {
      console.log("req.body.data", updatedData);

      const response = await addInfo(updatedData);
      if (response && response.driverId) {
        localStorage.setItem("driverId", response.driverId);
        completeStep(4);
        navigate("/driver/addVehicle");
      }
    } catch (error) {
      scrollTo({
        top: 120,
        behavior: "smooth",
      });
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-6">
      <div className="bg-[#FFFBFB] rounded-2xl p-6 max-w-2xl w-full text-center shadow-xl mx-4 sm:mx-auto">
        <h1 className="font-primary text-3xl text-black">NexaDrive</h1>
        <p className="text-sm text-black mt-0.5">Driver Information Form</p>
        <div className="md:w-md  md:ml-25">
          <LabelStepper count={2} step={4} />
        </div>
        {error && <p className="text-red-500 mt-3 text-xs">{error}</p>}

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-4 space-y-3 text-left"
        >
          {/* Full Name */}
          <label className="block font-medium text-black text-sm">
            Full Name
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <input
                type="text"
                placeholder="First name"
                {...register("firstName")}
                defaultValue={googleAuthData?.name || ""}
                className="w-full h-11 mt-3 mb-3 shadow-inner shadow-gray-500/80 p-4 rounded-3xl bg-[#EEEDED] placeholder:text-xs border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <input
                type="text"
                placeholder="*Last name "
                {...register("lastName")}
                className="w-full h-11 mt-3 mb-3 shadow-inner shadow-gray-500/80 p-4 rounded-3xl bg-[#EEEDED] placeholder:text-xs border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Permanent Address */}
          <label className="block font-medium text-black text-sm">
            Permanent Address
          </label>
          <div>
            <input
              type="text"
              placeholder="Street Address"
              {...register("street")}
              className="w-full h-11 mt-3 mb-3 shadow-inner shadow-gray-500/80 p-4 rounded-3xl bg-[#EEEDED] placeholder:text-xs border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
            />
            {errors.street && (
              <p className="text-red-500 text-xs">{errors.street.message}</p>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <input
                type="text"
                placeholder="City"
                {...register("city")}
                className="w-full h-11 mt-3 mb-3 shadow-inner shadow-gray-500/80 p-4 rounded-3xl bg-[#EEEDED] placeholder:text-xs border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
              />
              {errors.city && (
                <p className="text-red-500 text-xs">{errors.city.message}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                placeholder="State"
                {...register("state")}
                className="w-full h-11 mt-3 mb-3 shadow-inner shadow-gray-500/80 p-4 rounded-3xl bg-[#EEEDED] placeholder:text-xs border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
              />
              {errors.state && (
                <p className="text-red-500 text-xs">{errors.state.message}</p>
              )}
            </div>
          </div>
          <div>
            <input
              type="number"
              placeholder="Postal / Zip code"
              {...register("zip")}
              className="w-full h-11 mt-3 mb-3 shadow-inner shadow-gray-500/80 p-4 rounded-3xl bg-[#EEEDED] placeholder:text-xs border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
            />
            {errors.zip && (
              <p className="text-red-500 text-xs">{errors.zip.message}</p>
            )}
          </div>

          {/* Contact & License Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-black text-sm">
                Phone
              </label>
              <input
                type="number"
                placeholder="Phone"
                {...register("phone")}
                className="w-full h-11 mt-3 mb-3 shadow-inner shadow-gray-500/80 p-4 rounded-3xl bg-[#EEEDED] placeholder:text-xs border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs">{errors.phone.message}</p>
              )}
            </div>
            <div>
              <label className="block font-medium text-black text-sm">
                Date of Birth
              </label>
              <input
                type="date"
                {...register("dob")}
                className="w-full h-11 mt-3 mb-3 shadow-inner shadow-gray-500/80 p-4 rounded-3xl bg-[#EEEDED] placeholder:text-xs border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
              />
              {errors.dob && (
                <p className="text-red-500 text-xs">{errors.dob.message}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-black text-sm">
                Driver's License Number
              </label>
              <input
                type="sting"
                placeholder="License Number"
                {...register("licenseNumber")}
                className="w-full h-11 mt-3 mb-3 shadow-inner shadow-gray-500/80 p-4 rounded-3xl bg-[#EEEDED] placeholder:text-xs border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
              />
              {errors.licenseNumber && (
                <p className="text-red-500 text-xs">
                  {errors.licenseNumber.message}
                </p>
              )}
            </div>
            <div>
              <label className="block font-medium text-black text-sm">
                Date of Expiration
              </label>
              <input
                type="date"
                {...register("expirationDate")}
                className="w-full h-11 mt-3 mb-3 shadow-inner shadow-gray-500/80 p-4 rounded-3xl bg-[#EEEDED] placeholder:text-xs border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
              />
              {errors.expirationDate && (
                <p className="text-red-500 text-xs">
                  {errors.expirationDate.message}
                </p>
              )}
            </div>
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-black text-sm">
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                {...register("password")}
                className="w-full h-11 mt-3 mb-3 shadow-inner shadow-gray-500/80 p-4 rounded-3xl bg-[#EEEDED] placeholder:text-xs border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
              />
              {errors.password && (
                <p className="text-red-500 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <label className="block font-medium text-black text-sm">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm password"
                {...register("confirmPassword")}
                className="w-full h-11 mt-3 mb-3 shadow-inner shadow-gray-500/80 p-4 rounded-3xl bg-[#EEEDED] placeholder:text-xs border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-2.5 rounded-xl hover:bg-gray-900 transition text-sm mt-4"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default DAddInfo;
