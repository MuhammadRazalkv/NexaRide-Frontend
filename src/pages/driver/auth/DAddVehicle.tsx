import LabelStepper from "../../../components/user/Stepper";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Upload } from "lucide-react";
import { useState } from "react";
import Checkbox from "../../../components/Icons/CheckBox";
import BinButton from "../../../components/Icons/BinBtn";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { addVehicle } from "../../../api/auth/driver";
import { useDispatch } from "react-redux";
import { loginSuccessDriver } from "@/redux/slices/driverAuthSlice";
import { vehicleSchema } from "@/utils/validations/vehicleSchema";
import { message } from "@/constants/declaration";

export type FormData = yup.InferType<typeof vehicleSchema>;
const DAddVehicle = () => {
  const [frontView, setFrontView] = useState<string | null>(null);
  const [rearView, setRearView] = useState<string | null>(null);
  const [interiorView, setInteriorView] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [imgError, setImgError] = useState("");
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: (image: string) => void,
    setError: (error: string) => void
  ) => {
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]; // Allowed image types

    const file = e.target.files?.[0]; // Ensure a file is selected
    if (!file) return;

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only JPG, PNG, and WEBP images are allowed.");
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError("File size must be less than 2MB.");
      return;
    }

    // Reset error state
    setError("");

    // Read the file and set the image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        setImage(reader.result as string);
      }
    };
    reader.onerror = () => {
      console.error("Error reading file");
      setError("Failed to read the file.");
    };
    reader.readAsDataURL(file);
  };

  const handleFrontView = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleImageUpload(e, setFrontView, setImgError);

  const handleRearView = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleImageUpload(e, setRearView, setImgError);

  const handleInteriorView = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleImageUpload(e, setInteriorView, setImgError);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(vehicleSchema),
  });

  const onSubmit = async (data: FormData) => {
    setError("");
    if (!frontView || !rearView || !interiorView) {
      setImgError("Vehicle images are required");
      return;
    }
    if (!isChecked) {
      setError("Please accept to the Terms ");
      scrollTo({
        top: 120,
        behavior: "smooth",
      });
      return;
    }

    // const driverId = localStorage.getItem("driverId");
    // if (!driverId) {
    //   setError("Driver id is missing");
    //   setTimeout(() => {
    //     navigate("/driver/signup");
    //   }, 1000);
    // }

    const updatedData = {
      // driverId: driverId || "",
      nameOfOwner: `${data.firstName.trimStart()} ${
        data.lastName.trimEnd() || ""
      }`,
      addressOfOwner: data.address,
      brand: data.brand,
      vehicleModel: data.model,
      color: data.color,
      numberPlate: data.licenseNumber,
      regDate: data.registrationDate,
      expDate: data.expirationDate,
      insuranceProvider: data.insuranceProvider,
      policyNumber: data.policyNumber,
      vehicleImages: {
        frontView,
        rearView,
        interiorView,
      },
    };

    // https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/toyota/modelyear/2020?format=json

    try {
      setLoading(true);
      const response = await addVehicle(updatedData);
      if (response) {
        setSuccess("Your account has been created successfully.");
        setLoading(false);
        const driver = response.driver;
        localStorage.clear();
        setTimeout(() => {
          dispatch(
            loginSuccessDriver({ driverInfo: driver, token: response.token })
          );
          navigate("/driver/verification-pending");
        }, 2000);
      }
    } catch (error) {
      setLoading(false);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Internal server error");
      }
    }
  };

  const changeCheckBox = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-6">
      <div className="bg-[#FFFBFB] rounded-2xl p-6 max-w-2xl w-full text-center shadow-xl mx-4 sm:mx-auto">
        <h1 className="font-primary text-3xl text-black">NexaDrive</h1>
        <p className="text-sm text-black mt-0.5">Vehicle Information Form</p>
        <div className="md:w-md  md:ml-25">
          <LabelStepper count={3} step={4} />
        </div>
        {error && <p className="text-red-500 mt-3 text-xs">{error}</p>}
        {error && <p className="text-green-500 mt-3 text-xs">{success}</p>}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-4 space-y-3 text-left"
        >
          {/* Full Name */}
          <label className="block font-medium text-black text-sm">
            Name of owner
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <input
                type="text"
                placeholder="First name"
                {...register("firstName")}
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
            Address of owner
          </label>
          <div>
            <input
              type="text"
              placeholder="Address"
              {...register("address")}
              className="w-full h-11 mt-3 mb-3 shadow-inner shadow-gray-500/80 p-4 rounded-3xl bg-[#EEEDED] placeholder:text-xs border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
            />
            {errors.address && (
              <p className="text-red-500 text-xs">{errors.address.message}</p>
            )}
          </div>

          {/* Vehicle Details */}
          <label className="block font-medium text-black text-sm">
            Vehicle info
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <input
                type="text"
                placeholder="Brand"
                {...register("brand")}
                className="w-full h-11 mt-3 mb-3 shadow-inner shadow-gray-500/80 p-4 rounded-3xl bg-[#EEEDED] placeholder:text-xs border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
              />
              {errors.brand && (
                <p className="text-red-500 text-xs">{errors.brand.message}</p>
              )}
            </div>

            <div>
              {/* <label className="block font-medium text-black text-sm">Model</label> */}
              <input
                type="text"
                {...register("model")}
                placeholder="Model"
                className="w-full h-11 mt-3 mb-3 shadow-inner shadow-gray-500/80 p-4 rounded-3xl bg-[#EEEDED] placeholder:text-xs border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
              />
              {errors.model && (
                <p className="text-red-500 text-xs">{errors.model.message}</p>
              )}
            </div>
          </div>

          {/*  Color and Number plate  */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              {/* <label className="block font-medium text-black text-sm">Vehicle Color </label> */}
              <input
                type="text"
                placeholder="Color"
                {...register("color")}
                className="w-full h-11 mt-3 mb-3 shadow-inner shadow-gray-500/80 p-4 rounded-3xl bg-[#EEEDED] placeholder:text-xs border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
              />
              {errors.color && (
                <p className="text-red-500 text-xs">{errors.color.message}</p>
              )}
            </div>

            <div>
              {/* <label className="block font-medium text-black text-sm">Number Plate </label> */}
              <input
                type="text"
                placeholder="Number plate"
                {...register("licenseNumber")}
                className="w-full h-11 mt-3 mb-3 shadow-inner shadow-gray-500/80 p-4 rounded-3xl bg-[#EEEDED] placeholder:text-xs border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
              />
              {errors.licenseNumber && (
                <p className="text-red-500 text-xs">
                  {errors.licenseNumber.message}
                </p>
              )}
            </div>
          </div>

          {/* Vehicle images  */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
            {/* Front View */}
            <div className="w-full max-w-xs mx-auto">
              {frontView ? (
                <div className="relative group">
                  <img
                    src={frontView}
                    alt="Front View"
                    className="w-44 h-44 object-cover rounded-xl border border-gray-300 shadow-md transition-transform transform"
                  />
                  <div className="absolute top-2 right-6 ">
                    <BinButton onClick={() => setFrontView(null)} />
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-44 p-4 border-2 border-dashed border-gray-400 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                  <Upload size={28} className="text-gray-500 mb-2" />
                  <span className="text-gray-700 text-sm">Front View</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFrontView}
                    accept="image/*"
                  />
                </label>
              )}
            </div>

            {/* Rear View */}
            <div className="w-full max-w-xs mx-auto">
              {rearView ? (
                <div className="relative group">
                  <img
                    src={rearView}
                    alt="Rear View"
                    className="w-44 h-44 object-cover rounded-xl border border-gray-300 shadow-md transition-transform transform"
                  />
                  <div className="absolute top-2 right-6 ">
                    <BinButton onClick={() => setRearView(null)} />
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-44 p-4 border-2 border-dashed border-gray-400 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                  <Upload size={28} className="text-gray-500 mb-2" />
                  <span className="text-gray-700 text-sm">Rear View</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleRearView}
                    accept="image/*"
                  />
                </label>
              )}
            </div>

            {/* Interior View */}
            <div className="w-full max-w-xs mx-auto">
              {interiorView ? (
                <div className="relative group">
                  <img
                    src={interiorView}
                    alt="Interior View"
                    className="w-44 h-44 object-cover rounded-xl border border-gray-300 shadow-md transition-transform transform "
                  />
                  <div className="absolute top-2 right-6 ">
                    <BinButton onClick={() => setInteriorView(null)} />
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-44 p-4 border-2 border-dashed border-gray-400 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                  <Upload size={28} className="text-gray-500 mb-2" />
                  <span className="text-gray-700 text-sm">Interior</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleInteriorView}
                    accept="image/*"
                  />
                </label>
              )}
            </div>
          </div>

          {imgError && <p className="text-red-500 mt-3 text-xs">{imgError}</p>}

          {/* Registration Dates  */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-black text-sm">
                Registration Date
              </label>
              <input
                type="date"
                {...register("registrationDate")}
                className="w-full h-11 mt-3 mb-3 shadow-inner shadow-gray-500/80 p-4 rounded-3xl bg-[#EEEDED] placeholder:text-xs border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
              />
              {errors.registrationDate && (
                <p className="text-red-500 text-xs">
                  {errors.registrationDate.message}
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

          {/* Insurance details  */}

          <label className="block font-medium text-black text-sm">
            Insurance details{" "}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <input
                type="text"
                placeholder="Insurance Provide"
                {...register("insuranceProvider")}
                className="w-full h-11 mt-3 mb-3 shadow-inner shadow-gray-500/80 p-4 rounded-3xl bg-[#EEEDED] placeholder:text-xs border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
              />
              {errors.insuranceProvider && (
                <p className="text-red-500 text-xs">
                  {errors.insuranceProvider.message}
                </p>
              )}
            </div>

            <div>
              {/* <label className="block font-medium text-black text-sm">Number Plate </label> */}
              <input
                type="text"
                placeholder="Policy Number"
                {...register("policyNumber")}
                className="w-full h-11 mt-3 mb-3 shadow-inner shadow-gray-500/80 p-4 rounded-3xl bg-[#EEEDED] placeholder:text-xs border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
              />
              {errors.policyNumber && (
                <p className="text-red-500 text-xs">
                  {errors.policyNumber.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex items-center justify-center w-6 h-6">
              <Checkbox isChecked={isChecked} onChange={changeCheckBox} />
            </div>
            <p className="text-xs text-gray-500 font-medium">{message}</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-2.5 rounded-xl hover:bg-gray-900 transition text-sm mt-4"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DAddVehicle;
