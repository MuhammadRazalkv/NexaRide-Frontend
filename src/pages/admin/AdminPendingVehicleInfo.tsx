import { IPendingVehicle } from "@/interfaces/vehicle.interface";
import { useState } from "react";


interface AdminPendingVehicleInfoProps {
  setShowVehicleModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedVehicle: IPendingVehicle;
  setVehicleCategory: React.Dispatch<React.SetStateAction<string>>;
  // setSelectedImage: React.Dispatch<React.SetStateAction<string | null>>
  vehicleCategory: string;
  approveVehicle: (vehicleId: string, category: string) => Promise<void>;
  handleRejectClickVehicle: (vehicleId: string) => void;
}
const AdminPendingVehicleInfo: React.FC<AdminPendingVehicleInfoProps> = ({
  setShowVehicleModal,
  selectedVehicle,
  setVehicleCategory,
  vehicleCategory,
  approveVehicle,
  handleRejectClickVehicle,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-60 z-50">
      <div className="bg-[#1A2036] p-6 rounded-lg shadow-xl border border-[#2C3347]/50 max-w-md w-full mx-4 relative">
        {/* Close Button */}
        <button
          onClick={() => setShowVehicleModal(false)}
          className="absolute top-3 right-3 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-full text-lg"
        >
          &times;
        </button>

        {/* Modal Title */}
        <h3 className="text-white text-2xl font-bold text-center mb-4">
          Vehicle Details
        </h3>

        {/* Vehicle Information */}
        <div className="text-gray-400 space-y-2">
          <p>
            <strong>Owner:</strong> {selectedVehicle.nameOfOwner}
          </p>
          <p>
            <strong>Address:</strong> {selectedVehicle.addressOfOwner}
          </p>
          <p>
            <strong>Brand:</strong> {selectedVehicle.brand}
          </p>
          <p>
            <strong>Model:</strong> {selectedVehicle.vehicleModel}
          </p>
          <p>
            <strong>Color:</strong> {selectedVehicle.color}
          </p>
          <p>
            <strong>License Plate:</strong> {selectedVehicle.numberPlate}
          </p>
          <p>
            <strong>Reg Date:</strong>{" "}
            {new Date(selectedVehicle.regDate).toLocaleDateString("en-GB")}
          </p>
          <p>
            <strong>Exp Date:</strong>{" "}
            {new Date(selectedVehicle.expDate).toLocaleDateString("en-GB")}
          </p>
          <p>
            <strong>Insurance Provider:</strong>{" "}
            {selectedVehicle.insuranceProvider}
          </p>
          <p>
            <strong>Policy Number:</strong> {selectedVehicle.policyNumber}
          </p>
          {selectedVehicle.category ? (
            <p>
              <strong>Category :</strong> {selectedVehicle.category}
            </p>
          ) : (
            <div className="w-full h-4 mt-2 mb-6 ">
              <label htmlFor="">
                <strong>Choose a vehicle category :</strong>{" "}
              </label>
              <select
                onChange={(e) => setVehicleCategory(e.target.value)}
                name="Category"
                className="rounded-sm px-2 p-1 border text-sm"
                // defaultValue={'Choose '}
              >
                <option defaultChecked selected>
                  Choose{" "}
                </option>
                <option value="basic">Basic</option>
                <option value="premium">Premium</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>
          )}
        </div>

        {/* Vehicle Images with Click Event */}
        <div className="flex justify-center gap-3 mt-4">
          {["frontView", "rearView", "interiorView"].map((view) => (
            <img
              key={view}
              src={
                (selectedVehicle.vehicleImages as Record<string, string>)[view]
              }
              alt={`${view} view`}
              className="w-24 h-24 rounded-lg object-cover border border-[#2C3347] cursor-pointer"
              onClick={() =>
                setSelectedImage(
                  (selectedVehicle.vehicleImages as Record<string, string>)[
                    view
                  ]
                )
              }
            />
          ))}
        </div>

        {/* Full-Size Image Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
            onClick={() => setSelectedImage(null)}
          >
            <img
              src={selectedImage}
              alt="Full-size view"
              className="max-w-full max-h-full rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Action Buttons */}
        {selectedVehicle.status == "pending" ? (
          <div className="flex gap-3 mt-6 justify-center">
            <button
              onClick={() =>
                approveVehicle(selectedVehicle._id, vehicleCategory)
              }
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-all"
            >
              Approve
            </button>

            <button
              onClick={() => handleRejectClickVehicle(selectedVehicle._id)}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-all"
            >
              Reject
            </button>
          </div>
        ) : (
          <p className="text-white font-bold mt-3">
            Vehicle has been{" "}
            {selectedVehicle.status == "approved" ? "approved" : "rejected "}{" "}
            successfully
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminPendingVehicleInfo;
