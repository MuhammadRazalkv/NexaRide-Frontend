import { Default_Pfp } from "@/Assets";

const ProfileHead = ({
  profilePic,
  name,
  totalRides,
  ratings,
  variant,
  isVehicleInfo,
  setIsVehicleInfo,
}: {
  profilePic?: string;
  name?: string;
  totalRides?: number;
  ratings?: { avgRating: number; totalRatings: number };
  variant: "user" | "driver";
  isVehicleInfo: boolean;
  setIsVehicleInfo?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="container mx-auto px-2 py-4">
      <div className="bg-[#1A2036] rounded-md p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Total Rides (md and above) */}
          <div className="hidden md:block text-white text-center">
            <p className="text-sm text-gray-300">Total Rides</p>
            <p className="text-lg font-semibold">{totalRides || 0}</p>
          </div>

          {/* Profile Image and Name */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-gray-300">
              <img
                src={profilePic || Default_Pfp}
                alt="User profile"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-white mt-2 text-sm md:text-lg font-medium">
              {name || "Name"}
            </p>

            {/* Metrics under image (only on small devices) */}
            <div className="flex flex-col xs:flex-row gap-4 mt-4 md:hidden">
              <div className="text-white text-center">
                <p className="text-sm text-gray-300">Total Rides</p>
                <p className="text-sm font-semibold">{totalRides || 0}</p>
              </div>
              <div className="text-white text-center">
                <p className="text-sm text-gray-300">Rating</p>
                <p className="text-sm font-semibold">
                  {ratings?.avgRating + " / " + ratings?.totalRatings || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Rating (md and above) */}
          <div className="hidden md:block text-white text-center">
            <p className="text-sm text-gray-300">Rating</p>
            <p className="text-lg font-semibold">
              {ratings?.avgRating + "/" + ratings?.totalRatings || 0}{" "}
            </p>
          </div>
        </div>

        {/* Bottom Navigation Tabs */}
        <div className="mt-4 overflow-x-auto">
          <div className="flex justify-center gap-4 text-sm text-white border-t border-blue-900 pt-2">
            <button
              className={`${
                !isVehicleInfo ? "text-blue-400" : ""
              } hover:text-blue-400`}
              onClick={() => {
                if (setIsVehicleInfo) setIsVehicleInfo(false);
              }}
            >
              Profile
            </button>
            {variant == "driver" && (
              <button
                className={`${
                  isVehicleInfo ? "text-blue-400" : ""
                } hover:text-blue-400`}
                onClick={() => {
                  if (setIsVehicleInfo) setIsVehicleInfo(true);
                }}
              >
                Vehicle Info
              </button>
            )}

            {/* <button className="hover:text-blue-400">Travel History</button>
            <button className="hover:text-blue-400">Payment History</button>
            <button className="hover:text-blue-400">Feedback</button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHead;
