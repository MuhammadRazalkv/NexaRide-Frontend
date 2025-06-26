import { TbMessage } from "react-icons/tb";
import ToggleSwitch from "./ToggleSwitch";
import { useState } from "react";
import { updateIsAvailable } from "@/api/auth/driver";
import { message } from "antd";
import { IRideReqInfo, IDriverRoute } from "@/pages/driver/ride/DRide";

type RideInfoCardProps = {
  rideReqInfo?: IRideReqInfo ;
  driverRoute?: IDriverRoute;
  ridePhase: "idle" | "toPickup" | "otpVerified" | "toDropOff";
  //   isAvailable: boolean;
  handleLocationUpdate: () => void;
  //   handleAvailabilityChange: (val: boolean) => void;
  setChatOn: (val: boolean) => void;
  setIsCancelOpen: (val: boolean) => void;
};

const RideInfoCard: React.FC<RideInfoCardProps> = ({
  rideReqInfo,
  driverRoute,
  ridePhase,
  //   isAvailable,
  handleLocationUpdate,
  //   handleAvailabilityChange,
  setChatOn,
  setIsCancelOpen,
}) => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  const handleAvailabilityChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newAvailability = e.target.checked;
    setIsAvailable(newAvailability);

    try {
      const res = await updateIsAvailable();

      if (!res.success) {
        setIsAvailable(!newAvailability);
        messageApi.error("Failed to change availability");
      }
    } catch (error) {
      setIsAvailable(!newAvailability); // Revert on error
      messageApi.error("Failed to change availability");
      console.error(error);
    }
  };

  return (
    <>
      {contextHolder}
      <div className="bg-white rounded-2xl shadow-xl p-6 flex max-h-min flex-col gap-4">
        {!rideReqInfo && (
          <div className="bg-white mt-4 p-4 rounded-xl shadow-md ">
            <button
              onClick={handleLocationUpdate}
              className="bg-black text-white px-4 py-2 rounded-lg transition-transform duration-200 hover:scale-105 hover:bg-gray-800"
            >
              Assign Location
            </button>
            <div className="flex items-center gap-3 mt-3">
              <p className="text-gray-700 font-medium">Ready to take rides</p>
              <ToggleSwitch
                isChecked={isAvailable}
                onChange={handleAvailabilityChange}
              />
            </div>
          </div>
        )}

        <h2 className="text-xl font-bold text-gray-800">Ride Info</h2>
        <p className="text-gray-600">
          Details about your current status and rides.
        </p>

        {rideReqInfo && driverRoute && (
          <div className="mt-4 border-t border-gray-200 pt-4 space-y-3">
            {ridePhase === "toPickup" && (
              <>
                <p className="text-sm text-gray-500 mt-2">
                  <span className="font-medium text-black">Reach by:</span>{" "}
                  {driverRoute.reachBy.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>

                <p className="text-sm text-gray-500">
                  <span className="font-medium text-black">
                    Distance to Pickup:
                  </span>{" "}
                  {(driverRoute.distance / 1000).toFixed(2)} km
                </p>

                <div className="flex flex-col sm:flex-row mt-6 gap-3">
                  <button
                    className="bg-black text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-800 transition duration-200 w-full sm:w-auto flex items-center justify-center space-x-2"
                    onClick={() => setChatOn(true)}
                  >
                    <TbMessage className="text-white text-base" />
                    <span>Message User</span>
                  </button>

                  <button
                    className="bg-red-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200 w-full sm:w-auto"
                    onClick={() => setIsCancelOpen(true)}
                  >
                    Cancel Ride
                  </button>
                </div>
              </>
            )}

            {ridePhase === "toDropOff" && (
              <>
                <p className="text-sm text-gray-500">
                  <span className="font-medium text-black">From:</span>{" "}
                  {rideReqInfo.pickupLocation}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium text-black">To:</span>{" "}
                  {rideReqInfo.dropOffLocation}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium text-black">Distance:</span>{" "}
                  {rideReqInfo.distance
                    ? (rideReqInfo.distance / 1000).toFixed(2)
                    : "N/A"}{" "}
                  km
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium text-black">Fare:</span> ₹
                  {rideReqInfo.fare}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium text-black">
                    Estimated Drop-off:
                  </span>{" "}
                  {rideReqInfo.time
                    ? new Date(
                        Date.now() + rideReqInfo.time * 1000
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "NA"}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default RideInfoCard;
