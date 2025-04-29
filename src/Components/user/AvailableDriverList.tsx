import { Drivers } from "@/interfaces/ride.interface";
import { Car3D } from "@/Assets";
import { Rate } from "antd";
interface DriverListProps {
    availableDrivers:Drivers[],
    bookTheCab:(id:string,fare:number)=>void
}
const AvailableDriverList:React.FC<DriverListProps> = ({availableDrivers,bookTheCab}) => {
  return (
    <div className="grid grid-cols-1 bg-gray-50 mt-2 rounded-2xl gap-4 p-4">
      {availableDrivers.map((driver, index) => (
        <div
          key={index}
          className="bg-white flex items-center hover:bg-gray-200 shadow-md rounded-2xl p-3 border border-gray-200 hover:shadow-lg transition duration-300"
          onClick={() => bookTheCab(driver._id, driver.totalFare)}
        >
          <img
            src={Car3D}
            alt="car model"
            className="h-28 w-28 object-contain rounded-lg p-2"
          />

          <div className="ml-4 w-full">
            <h3 className="text-lg font-semibold text-gray-800">
              {driver.name}
            </h3>
            <div className="flex items-center gap-2">
              <Rate
                allowHalf
                value={driver.avgRating}
                disabled
                style={{ fontSize: "16px", color: "#facc15" }}
              />
              <span className="text-sm text-gray-600">
                {driver.avgRating?.toFixed(1)} ({driver.totalRatings})
              </span>
            </div>

            <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
              <div>
                <p className="font-medium">
                  {driver.vehicleDetails.vehicleModel}
                </p>
                <p className="text-xs text-gray-500">
                  {driver.vehicleDetails.category}
                </p>
              </div>

              <div className="text-center">
                <p className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-bold">
                  ₹{driver.totalFare}
                </p>
                {driver.distanceInKm && driver.timeInMinutes && (
                  <p className="text-xs text-gray-500">
                    {driver.distanceInKm} km • {driver.timeInMinutes} min
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AvailableDriverList;
