import { TbMessage } from "react-icons/tb";
import { Car3D } from "@/Assets";
import { RideInfo } from "@/utils/socket";
import { DriverRoute } from "@/interfaces/ride.interface";
type RideInfoCardProps = {
  rideInfo: RideInfo;
  driverRoute?: DriverRoute;
  toDropOff: boolean;
  driverArrived: boolean;
  setChatOn: (val: boolean) => void;
  setIsCancelOpen: (val: boolean) => void;
};

const RideInfoCard: React.FC<RideInfoCardProps> = ({
  rideInfo,
  driverRoute,
  toDropOff,
  driverArrived,
  setChatOn,
  setIsCancelOpen,
}) => {
  if (!rideInfo) return null;

  return (
    <>
      {/* Driver Info */}
      <div className="flex items-center gap-5 mb-5">
        <img
          src={Car3D}
          alt="Car"
          className="w-24 h-24 rounded-xl object-cover"
        />
        <div>
          <h2 className="text-lg font-semibold text-black">
            {rideInfo.driver.name}
          </h2>
          <p className="text-sm text-gray-600">
            {rideInfo.driver.vehicleDetails.vehicleModel.charAt(0).toUpperCase() +
              rideInfo.driver.vehicleDetails.vehicleModel.slice(1)}
          </p>
        </div>
      </div>

      {toDropOff ? (
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h3 className="text-xl font-semibold text-black mb-2">
            Your ride is in progress
          </h3>
          <ul className="text-sm text-gray-700 space-y-1 mb-4">
            <li>
              <span className="font-medium text-black">Ride Started At:</span>{" "}
              {new Date(rideInfo.startedTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </li>
            <li>
              <span className="font-medium text-black">Total Distance:</span>{" "}
              {(rideInfo.distance / 1000).toFixed(2)} km
            </li>
            <li>
              <span className="font-medium text-black">Estimated Duration:</span>{" "}
              {(rideInfo.estTime / 60).toFixed(0)} mins
            </li>
            <li>
              <span className="font-medium text-black">Estimated Fare:</span>{" "}
              ₹ {rideInfo.totalFare}
            </li>
          </ul>
        </div>
      ) : (
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-bold text-black flex items-center mb-4">
            {driverArrived
              ? "Your driver has arrived at the pickup point"
              : "Your driver is on the way"}
          </h3>

          {driverRoute ? (
            <ul className="space-y-3 text-base text-gray-700">
              {!driverArrived && (
                <>
                  <li>
                    <span className="font-medium text-black">
                      Estimated Arrival:
                    </span>{" "}
                    {(driverRoute.time / 60).toFixed(0)} mins
                  </li>
                  <li>
                    <span className="font-medium text-black">
                      Distance to Pickup:
                    </span>{" "}
                    {(driverRoute.distance / 1000).toFixed(2)} km
                  </li>
                </>
              )}
              <li>
                <span className="font-medium text-black">OTP for Verification:</span>{" "}
                <span className="bg-gray-100 text-black font-semibold px-3 py-1 rounded shadow-sm tracking-wider inline-block">
                  {rideInfo.OTP}
                </span>
              </li>
            </ul>
          ) : (
            <p className="text-gray-500">Loading driver route...</p>
          )}

          <div className="flex flex-col sm:flex-row mt-6 gap-3">
            <button
              className="bg-black text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-800 transition duration-200 w-full sm:w-auto flex items-center justify-center gap-2"
              onClick={() => setChatOn(true)}
            >
              <TbMessage className="text-white text-sm" />
              <span>Message Driver</span>
            </button>
            <button
              className="bg-red-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200 w-full sm:w-auto"
              onClick={() => setIsCancelOpen(true)}
            >
              Cancel Ride
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default RideInfoCard;
