import {
  IPendingDriver,
  IPendingVehicle,
} from "@/pages/admin/AdminPendingDriver";

interface PendingDriverInfoProps {
  setSelectedDriver: React.Dispatch<
    React.SetStateAction<IPendingDriver | null>
  >;
  selectedDriver: IPendingDriver;
  submitApproval: (driverId: string) => Promise<void>;
  handleRejectClick: (driverId: string) => void;
  setSelectedVehicle: React.Dispatch<
    React.SetStateAction<IPendingVehicle | null>
  >;
  setShowVehicleModal: React.Dispatch<React.SetStateAction<boolean>>;
}
const PendingDriverInfo: React.FC<PendingDriverInfoProps> = ({
  setSelectedDriver,
  selectedDriver,
  handleRejectClick,
  submitApproval,
  setSelectedVehicle,
  setShowVehicleModal,
}) => {
  return (
    <>
      <div className="w-full max-w-md bg-[#1A2036] p-6 rounded-lg shadow-lg border border-[#2C3347]/50 mt-6 md:mt-0 md:ml-6 relative">
        {/* Close Button (Top Right) */}
        <button
          onClick={() => setSelectedDriver(null)}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full transition-all"
        >
          ✕
        </button>

        <h3 className="text-white text-xl font-semibold mb-4">
          Driver Details
        </h3>
        <div className="space-y-2">
          <p className="text-gray-400">
            <strong>Name:</strong> {selectedDriver.name}
          </p>
          <p className="text-gray-400">
            <strong>Email:</strong> {selectedDriver.email}
          </p>
          <p className="text-gray-400">
            <strong>License:</strong> {selectedDriver.license_number}
          </p>
          <p className="text-gray-400">
            <strong>Address:</strong> {selectedDriver.address.street},{" "}
            {selectedDriver.address.city}, {selectedDriver.address.state},{" "}
            {selectedDriver.address.pin_code}
          </p>
          <p className="text-gray-400">
            <strong>Date of Birth:</strong>{" "}
            {new Date(selectedDriver.dob).toLocaleDateString()}
          </p>
          <p className="text-gray-400">
            <strong>License Expiry:</strong>{" "}
            {new Date(selectedDriver.license_exp).toLocaleDateString()}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 mt-4">
          {selectedDriver.status == "pending" ? (
            <>
              <button
                onClick={() => submitApproval(selectedDriver._id)}
                className="h-12 px-4 bg-green-500 hover:bg-green-600 text-white rounded transition-all"
              >
                Accept
              </button>

              <button
                onClick={() => handleRejectClick(selectedDriver._id)}
                className="h-12 px-4 bg-red-500 hover:bg-red-600 text-white rounded transition-all"
              >
                Reject
              </button>
            </>
          ) : (
            <p className="text-white font-bold px-4 text-center ">
              Driver info verified
            </p>
          )}
          <button
            onClick={() => {
              setSelectedVehicle(selectedDriver.vehicleDetails);
              setShowVehicleModal(true);
            }}
            className="h-12 px-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded transition-all"
          >
            Vehicle Info
          </button>
        </div>
      </div>
    </>
  );
};

export default PendingDriverInfo;
