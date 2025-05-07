import { IAvailableCabs } from "@/interfaces/ride.interface";
import { Car3D } from "@/Assets";
interface DriverListProps {
  availableCabs: IAvailableCabs[];
  // availableDrivers: Drivers[];
  bookTheCab: (category: string, fare: number) => void;
}
const AvailableDriverList: React.FC<DriverListProps> = ({
  availableCabs,

  bookTheCab,
}) => {
  return (
    // <div className="grid grid-cols-1 bg-gray-50 mt-2 rounded-2xl gap-4 p-4">
    //   {availableCabs.map((category, index) => (
    //     <div
    //       key={index}
    //       className="bg-white flex items-center hover:bg-gray-200 shadow-md rounded-2xl p-3 border border-gray-200 hover:shadow-lg transition duration-300"
    //       // onClick={() => bookTheCab(driver._id, driver.totalFare)}
    //     >
    //       <img
    //         src={Car3D}
    //         alt="car model"
    //         className="h-28 w-28 object-contain rounded-lg p-2"
    //       />

    //       <div className="ml-4 w-full">
    //         <h3 className="text-lg font-semibold text-gray-800">
    //           {category.category.charAt(0).toLocaleUpperCase()+category.category.slice(1)}
    //           {` (${category.count})`}
    //         </h3>

    //         <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
    //           <div className="text-center">
    //             <p className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-bold">
    //               ₹{category.totalFare}
    //             </p>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   ))}
    // </div>
    <div className="grid grid-cols-1 bg-gray-50 mt-2 rounded-2xl gap-4 p-4">
    {availableCabs.map((category, index) => (
      <div
        key={index}
        className="bg-white flex items-center hover:bg-gray-100 shadow-md rounded-2xl p-3 border border-gray-200 hover:shadow-lg transition duration-300"
        onClick={()=>bookTheCab(category.category,category.totalFare)}
      >
        <img
          src={Car3D}
          alt="car model"
          className="h-28 w-28 object-contain rounded-xl p-2 bg-gray-100"
        />
  
        <div className="ml-4 w-full">
          <h3 className="text-xl font-semibold text-gray-800">
            {category.category.charAt(0).toUpperCase() + category.category.slice(1)}
            <span className="ml-2 text-sm font-medium text-gray-500">
              {`(${category.count} available)`}
            </span>
          </h3>
  
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              Estimated Fare:
            </div>
            <div className="bg-green-100 text-green-700 font-bold px-4 py-1 rounded-full text-base">
              ₹{category.totalFare}
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
  
  );
};

export default AvailableDriverList;
