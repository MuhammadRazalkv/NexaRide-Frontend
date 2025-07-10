import IDriver from "@/interfaces/driver.interface";
const formatDate = (date: Date | string) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
const DriverOtherInfos = ({info}:{info:IDriver}) => {
  return (
    <>
      <div className="p-2 text-start">
        <p className="mb-1 text-sm text-gray-300">State</p>
        <p className="px-4 py-3 bg-[#1A2036] rounded-lg hover:shadow-lg hover:shadow-blue-900">
          {info.state}
        </p>
      </div>
      <div className="p-2 text-start">
        <p className="mb-1 text-sm text-gray-300">City</p>
        <p className="px-4 py-3 bg-[#1A2036] rounded-lg hover:shadow-lg hover:shadow-blue-900">
          {info.city}
        </p>
      </div>
      <div className="p-2 text-start">
        <p className="mb-1 text-sm text-gray-300">Street</p>
        <p className="px-4 py-3 bg-[#1A2036] rounded-lg hover:shadow-lg hover:shadow-blue-900">
          {info.street}
        </p>
      </div>
      <div className="p-2 text-start">
        <p className="mb-1 text-sm text-gray-300">Pin code</p>
        <p className="px-4 py-3 bg-[#1A2036] rounded-lg hover:shadow-lg hover:shadow-blue-900">
          {info.pin_code}
        </p>
      </div>
      <div className="p-2 text-start">
        <p className="mb-1 text-sm text-gray-300">Date of birth</p>
        <p className="px-4 py-3 bg-[#1A2036] rounded-lg hover:shadow-lg hover:shadow-blue-900">
          {formatDate(info.dob)}
        </p>
      </div>
      <div className="p-2 text-start">
        <p className="mb-1 text-sm text-gray-300">License number </p>
        <p className="px-4 py-3 bg-[#1A2036] rounded-lg hover:shadow-lg hover:shadow-blue-900">
          {info.license_number}
        </p>
      </div>
      <div className="p-2 text-start">
        <p className="mb-1 text-sm text-gray-300">License Exp </p>
        <p className="px-4 py-3 bg-[#1A2036] rounded-lg hover:shadow-lg hover:shadow-blue-900">
          {formatDate(info.license_exp)}
        </p>
      </div>
    </>
  );
};

export default DriverOtherInfos;
