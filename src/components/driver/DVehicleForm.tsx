// import React from "react";
// import { FormData } from "@/pages/driver/auth/DAddVehicle";
// interface VehicleFormProps {
//   onSubmit: (data: FormData) => Promise<void>;
// }

// const DVehicleForm: React.FC<VehicleFormProps> = ({onSubmit}) => {
//   return (
//     <>
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="mt-4 space-y-3 text-left"
//       >
//         {/* Full Name */}
//         <label className="block font-medium text-black text-sm">
//           Name of owner
//         </label>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//           <div>
//             <input
//               type="text"
//               placeholder="First name"
//               {...register("firstName")}
//               className="w-full h-11 mt-3 mb-3 shadow-inner shadow-gray-500/80 p-4 rounded-3xl bg-[#EEEDED] placeholder:text-xs border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
//             />
//             {errors.firstName && (
//               <p className="text-red-500 text-xs">{errors.firstName.message}</p>
//             )}
//           </div>
//           <div>
//             <input
//               type="text"
//               placeholder="*Last name "
//               {...register("lastName")}
//               className="w-full h-11 mt-3 mb-3 shadow-inner shadow-gray-500/80 p-4 rounded-3xl bg-[#EEEDED] placeholder:text-xs border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
//             />
//             {errors.lastName && (
//               <p className="text-red-500 text-xs">{errors.lastName.message}</p>
//             )}
//           </div>
//         </div>

//         {/* Permanent Address */}
//         <label className="block font-medium text-black text-sm">
//           Address of owner
//         </label>
//         <div>
//           <input
//             type="text"
//             placeholder="Address"
//             {...register("address")}
//             className="w-full h-11 mt-3 mb-3 shadow-inner shadow-gray-500/80 p-4 rounded-3xl bg-[#EEEDED] placeholder:text-xs border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
//           />
//           {errors.address && (
//             <p className="text-red-500 text-xs">{errors.address.message}</p>
//           )}
//         </div>

//         {/* Vehicle Details */}
//         <label className="block font-medium text-black text-sm">
//           Vehicle info
//         </label>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//           <div>
//             <input
//               type="text"
//               placeholder="Brand"
//               {...register("brand")}
//               className="w-full h-11 mt-3 mb-3 shadow-inner shadow-gray-500/80 p-4 rounded-3xl bg-[#EEEDED] placeholder:text-xs border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
//             />
//             {errors.brand && (
//               <p className="text-red-500 text-xs">{errors.brand.message}</p>
//             )}
//           </div>

//           <div>
//             {/* <label className="block font-medium text-black text-sm">Model</label> */}
//             <input
//               type="text"
//               {...register("model")}
//               placeholder="Model"
//               className="w-full h-11 mt-3 mb-3 shadow-inner shadow-gray-500/80 p-4 rounded-3xl bg-[#EEEDED] placeholder:text-xs border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
//             />
//             {errors.model && (
//               <p className="text-red-500 text-xs">{errors.model.message}</p>
//             )}
//           </div>
//         </div>

//         {/*  Color and Number plate  */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//           <div>
//             {/* <label className="block font-medium text-black text-sm">Vehicle Color </label> */}
//             <input
//               type="text"
//               placeholder="Color"
//               {...register("color")}
//               className="w-full h-11 mt-3 mb-3 shadow-inner shadow-gray-500/80 p-4 rounded-3xl bg-[#EEEDED] placeholder:text-xs border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
//             />
//             {errors.color && (
//               <p className="text-red-500 text-xs">{errors.color.message}</p>
//             )}
//           </div>

//           <div>
//             {/* <label className="block font-medium text-black text-sm">Number Plate </label> */}
//             <input
//               type="text"
//               placeholder="Number plate"
//               {...register("licenseNumber")}
//               className="w-full h-11 mt-3 mb-3 shadow-inner shadow-gray-500/80 p-4 rounded-3xl bg-[#EEEDED] placeholder:text-xs border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
//             />
//             {errors.licenseNumber && (
//               <p className="text-red-500 text-xs">
//                 {errors.licenseNumber.message}
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Vehicle images  */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
//           {/* Front View */}
//           <div className="w-full max-w-xs mx-auto">
//             {frontView ? (
//               <div className="relative group">
//                 <img
//                   src={frontView}
//                   alt="Front View"
//                   className="w-44 h-44 object-cover rounded-xl border border-gray-300 shadow-md transition-transform transform"
//                 />
//                 <div className="absolute top-2 right-6 ">
//                   <BinButton onClick={() => setFrontView(null)} />
//                 </div>
//               </div>
//             ) : (
//               <label className="flex flex-col items-center justify-center w-full h-44 p-4 border-2 border-dashed border-gray-400 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
//                 <Upload size={28} className="text-gray-500 mb-2" />
//                 <span className="text-gray-700 text-sm">Front View</span>
//                 <input
//                   type="file"
//                   className="hidden"
//                   onChange={handleFrontView}
//                   accept="image/*"
//                 />
//               </label>
//             )}
//           </div>

//           {/* Rear View */}
//           <div className="w-full max-w-xs mx-auto">
//             {rearView ? (
//               <div className="relative group">
//                 <img
//                   src={rearView}
//                   alt="Rear View"
//                   className="w-44 h-44 object-cover rounded-xl border border-gray-300 shadow-md transition-transform transform"
//                 />
//                 <div className="absolute top-2 right-6 ">
//                   <BinButton onClick={() => setRearView(null)} />
//                 </div>
//               </div>
//             ) : (
//               <label className="flex flex-col items-center justify-center w-full h-44 p-4 border-2 border-dashed border-gray-400 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
//                 <Upload size={28} className="text-gray-500 mb-2" />
//                 <span className="text-gray-700 text-sm">Rear View</span>
//                 <input
//                   type="file"
//                   className="hidden"
//                   onChange={handleRearView}
//                   accept="image/*"
//                 />
//               </label>
//             )}
//           </div>

//           {/* Interior View */}
//           <div className="w-full max-w-xs mx-auto">
//             {interiorView ? (
//               <div className="relative group">
//                 <img
//                   src={interiorView}
//                   alt="Interior View"
//                   className="w-44 h-44 object-cover rounded-xl border border-gray-300 shadow-md transition-transform transform "
//                 />
//                 <div className="absolute top-2 right-6 ">
//                   <BinButton onClick={() => setInteriorView(null)} />
//                 </div>
//               </div>
//             ) : (
//               <label className="flex flex-col items-center justify-center w-full h-44 p-4 border-2 border-dashed border-gray-400 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
//                 <Upload size={28} className="text-gray-500 mb-2" />
//                 <span className="text-gray-700 text-sm">Interior</span>
//                 <input
//                   type="file"
//                   className="hidden"
//                   onChange={handleInteriorView}
//                   accept="image/*"
//                 />
//               </label>
//             )}
//           </div>
//         </div>

//         {imgError && <p className="text-red-500 mt-3 text-xs">{imgError}</p>}

//         {/* Registration Dates  */}

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//           <div>
//             <label className="block font-medium text-black text-sm">
//               Registration Date
//             </label>
//             <input
//               type="date"
//               {...register("registrationDate")}
//               className="w-full h-11 mt-3 mb-3 shadow-inner shadow-gray-500/80 p-4 rounded-3xl bg-[#EEEDED] placeholder:text-xs border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
//             />
//             {errors.registrationDate && (
//               <p className="text-red-500 text-xs">
//                 {errors.registrationDate.message}
//               </p>
//             )}
//           </div>

//           <div>
//             <label className="block font-medium text-black text-sm">
//               Date of Expiration
//             </label>
//             <input
//               type="date"
//               {...register("expirationDate")}
//               className="w-full h-11 mt-3 mb-3 shadow-inner shadow-gray-500/80 p-4 rounded-3xl bg-[#EEEDED] placeholder:text-xs border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
//             />
//             {errors.expirationDate && (
//               <p className="text-red-500 text-xs">
//                 {errors.expirationDate.message}
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Insurance details  */}

//         <label className="block font-medium text-black text-sm">
//           Insurance details{" "}
//         </label>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//           <div>
//             <input
//               type="text"
//               placeholder="Insurance Provide"
//               {...register("insuranceProvider")}
//               className="w-full h-11 mt-3 mb-3 shadow-inner shadow-gray-500/80 p-4 rounded-3xl bg-[#EEEDED] placeholder:text-xs border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
//             />
//             {errors.insuranceProvider && (
//               <p className="text-red-500 text-xs">
//                 {errors.insuranceProvider.message}
//               </p>
//             )}
//           </div>

//           <div>
//             {/* <label className="block font-medium text-black text-sm">Number Plate </label> */}
//             <input
//               type="text"
//               placeholder="Policy Number"
//               {...register("policyNumber")}
//               className="w-full h-11 mt-3 mb-3 shadow-inner shadow-gray-500/80 p-4 rounded-3xl bg-[#EEEDED] placeholder:text-xs border border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
//             />
//             {errors.policyNumber && (
//               <p className="text-red-500 text-xs">
//                 {errors.policyNumber.message}
//               </p>
//             )}
//           </div>
//         </div>

//         <div className="flex gap-3">
//           <div className="flex items-center justify-center w-6 h-6">
//             <Checkbox isChecked={isChecked} onChange={changeCheckBox} />
//           </div>
//           <p className="text-xs text-gray-500 font-medium">
//             I certify that the information given on this form is true and
//             correct to the best of my knowledge. I understand that as a
//             volunteer driver, I must be 18 years of age or older, possess a
//             valid driver’s license, have the proper and current license and
//             vehicle registration, and have the required insurance coverage in
//             effect on any vehicle used to transport participants of the event.
//           </p>
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="w-full bg-black text-white py-2.5 rounded-xl hover:bg-gray-900 transition text-sm mt-4"
//           disabled={loading}
//         >
//           {loading ? "Submitting..." : "Submit"}
//         </button>
//       </form>
//     </>
//   );
// };

// export default DVehicleForm;
