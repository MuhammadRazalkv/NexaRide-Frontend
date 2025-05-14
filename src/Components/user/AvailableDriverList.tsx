import { IAvailableCabs } from "@/interfaces/ride.interface";
import { Car3D } from "@/Assets";
import { Car,  Tag, Users } from "lucide-react";
import { useState } from "react";
interface DriverListProps {
  availableCabs: IAvailableCabs[];
  // availableDrivers: Drivers[];
  bookTheCab: (category: string, fare: number, offerId: string | null) => void;
}
const AvailableDriverList: React.FC<DriverListProps> = ({
  availableCabs,

  bookTheCab,
}) => {
  const [hoveredCab, setHoveredCab] = useState<number|null>(null);
  return (
    // <div className="grid grid-cols-1 bg-gray-50 mt-2 rounded-2xl gap-4 p-4">
    //   {availableCabs.map((category, index) => (
    //     <div
    //       key={index}
    //       className="bg-white flex items-center hover:bg-gray-100 shadow-md rounded-2xl p-3 border border-gray-200 hover:shadow-lg transition duration-300"
    //       onClick={() =>
    //         bookTheCab(category.category, category.baseFare, category.offerId)
    //       }
    //     >
    //       <img
    //         src={Car3D}
    //         alt="car model"
    //         className="h-28 w-28 object-contain rounded-xl p-2 bg-gray-100"
    //       />

    //       <div className="ml-4 w-full">
    //         <h3 className="text-xl font-semibold text-gray-800">
    //           {category.category.charAt(0).toUpperCase() +
    //             category.category.slice(1)}
    //           <span className="ml-2 text-sm font-medium text-gray-500">
    //             ({category.count} available)
    //           </span>
    //         </h3>

    //         {category.offerTitle && (
    //           <>
    //             <div className="mt-2 text-sm text-blue-600 font-medium">
    //               Offer Applied: {category.offerTitle} (-₹
    //               {category.discountApplied})
    //             </div>
    //             <p className="text-xs  text-gray-500 ">
    //               Final fare will be confirmed upon ride creation
    //             </p>
    //           </>
    //         )}

    //         <div className="flex justify-between items-center mt-4">
    //           <div className="text-sm text-gray-600">Estimated Fare:</div>
    //           <div className="bg-green-100 text-green-700 font-bold px-4 py-1 rounded-full text-base">
    //             ₹{category.finalFare}
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   ))}
    // </div>

    <div className="grid grid-cols-1 gap-4 p-4 mt-2 bg-gray-50 rounded-lg">
      {availableCabs.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-lg shadow">
          <Car className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-medium text-gray-700">
            No cabs available
          </h3>
          <p className="mt-2 text-gray-500">
            Please try again in a few minutes
          </p>
        </div>
      ) : (
        availableCabs.map((category, index) => (
          <button
            key={index}
            className={`bg-white w-full text-left flex items-center rounded-xl border transition duration-300 ${
              hoveredCab === index
                ? "border-blue-300 shadow-md"
                : "border-gray-200 shadow-sm"
            }`}
            onClick={() =>
              bookTheCab(category.category, category.baseFare, category.offerId)
            }
            onMouseEnter={() => setHoveredCab(index)}
            onMouseLeave={() => setHoveredCab(null)}
            aria-label={`Book ${category.category} cab for ₹${category.finalFare}`}
          >
            <div className="relative p-3">
              <div className="flex items-center justify-center h-32 w-32 bg-gray-50 rounded-xl overflow-hidden">
                <img
                  src={Car3D}
                  alt={`${category.category} cab`}
                  className="h-28 w-28 object-contain"
                />
              </div>
              {category.count < 3 && (
                <span className="absolute top-2 right-2 px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
                  Limited
                </span>
              )}
            </div>

            <div className="flex-1 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800">
                  {category.category.charAt(0).toUpperCase() +
                    category.category.slice(1)}
                </h3>
                <div className="flex items-center text-gray-600">
                  <Users size={16} className="mr-1" />
                  <span className="text-sm">{category.count} available</span>
                </div>
              </div>

              <div className="mt-2 space-y-3">
                {category.offerTitle && (
                  <div className="flex items-center">
                    <Tag className="w-4 h-4 mr-2 text-blue-600" />
                    <div>
                      <div className="text-sm font-medium text-blue-600">
                        {category.offerTitle} (-₹{category.discountApplied})
                      </div>
                      <p className="text-xs text-gray-500">
                        Final fare confirmed on booking
                      </p>
                    </div>
                  </div>
                )}

                {/* <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm">{category.estimatedTime || "15-20"} mins</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">{category.distance || "1.5"} km</span>
                  </div>
                </div> */}
              </div>

              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                <div className="text-sm font-medium text-gray-600">
                  Estimated Fare:
                </div>
                <div className="flex items-center">
                  {category.baseFare !== category.finalFare && (
                    <span className="mr-2 text-sm text-gray-500 line-through">
                      ₹{category.baseFare}
                    </span>
                  )}
                  <span className="px-3 py-1 text-base font-bold text-green-700 bg-green-100 rounded-full">
                    ₹{category.finalFare}
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))
      )}
    </div>
  );
};

export default AvailableDriverList;
