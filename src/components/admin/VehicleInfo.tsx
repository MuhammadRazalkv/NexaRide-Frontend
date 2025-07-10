import React from "react";
import IVehicle from "@/interfaces/vehicle.interface";

interface VehicleInfoProps {
  data?: IVehicle;
}

const formatDate = (date: Date | string) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const VehicleInfo: React.FC<VehicleInfoProps> = ({ data }) => {
  if (!data) {
    return <p className="text-gray-400">No data found</p>;
  }

  return (
    <div className="w-full">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-white">
          Vehicle Images
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3  gap-4 mb-6">
          {Object.entries(data.vehicleImages).map(([view, url]) => (
            <div key={view} className="text-center">
              <img
                src={url}
                alt={`${view} view`}
                className="w-full h-40 object-cover rounded-lg border border-gray-600"
              />
              <p className="mt-2 text-sm capitalize text-gray-300">
                {view.replace("View", " View")}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
        {Object.entries({
          "Owner Name": data.nameOfOwner,
          "Owner Address": data.addressOfOwner,
          Brand: data.brand,
          "Vehicle Model": data.vehicleModel,
          Color: data.color,
          "Number Plate": data.numberPlate,
          "Registration Date": formatDate(data.regDate),
          "Expiry Date": formatDate(data.expDate),
          "Insurance Provider": data.insuranceProvider,
          "Policy Number": data.policyNumber,
          Category: data.category ?? "N/A",
          Status: data.status ?? "Pending",
          "Rejection Reason": data.rejectionReason ?? "None",
          //   Verified: data.verified ? "Yes" : "No",
        }).map(([label, value]) => (
          <div key={label} className="p-2 text-start">
            <p className="mb-1 text-sm text-gray-300">{label}</p>
            <p className="px-4 py-3 bg-[#1A2036] rounded-lg hover:shadow-lg hover:shadow-blue-900">
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleInfo;
