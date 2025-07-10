import React from "react";
import { IRideHistoryItem } from "@/interfaces/fullRideInfo.interface";
import { formatDate } from "@/utils/DateAndTimeFormatter";
// export interface IRideHistoryItem {
//   _id: string;
//   pickupLocation: string;
//   dropOffLocation: string;
//   totalFare: number;
//   distance: number;
//   estTime: number;
//   timeTaken?: number;
//   status: "completed" | "cancelled" | "ongoing";
//   startedAt?: number;
//   endedAt?: number;
//   canceledAt?: number;
//   paymentStatus: "completed" | "pending" | "failed"| 'Not required';
//   // driverId: string;
//   // userId?: string;
//   driverEarnings?: number;
//   commission?: number;
// }

interface RideHistoryTableProps {
  rideHistory: IRideHistoryItem[];
  variant: "user" | "driver" | "admin";
  handleNavigation: (id: string) => void;
}

const RideHistoryTable: React.FC<RideHistoryTableProps> = ({
  rideHistory,
  variant,
  handleNavigation,
}) => {
  return (
    <div
      className={`overflow-x-auto ${
        variant === "admin"
          ? "bg-[#1A2036] rounded-xl shadow-lg text-gray-200"
          : "bg-white text-gray-700"
      } shadow-md rounded-xl`}
    >
      <table
        className={`min-w-full table-auto text-sm text-left ${
          variant === "admin" ? "text-gray-200" : "text-gray-700"
        }`}
      >
        <thead
          className={`uppercase text-xs ${
            variant === "admin"
              ? "bg-[#2B2F44] text-gray-300"
              : "bg-gray-100 text-gray-900"
          }`}
        >
          <tr>
            <th className="py-3 px-4">Date</th>
            <th className="py-3 px-4">Pickup</th>
            <th className="py-3 px-4">Drop-off</th>
            <th className="py-3 px-4">Total Fare (₹)</th>
            {variant !== "user" && (
              <>
                <th className="py-3 px-4">App Fee (₹)</th>
                <th className="py-3 px-4">{variant == 'admin'? 'Driver' : 'Your' } Fare (₹)</th>
              </>
            )}
            <th className="py-3 px-4">Distance (km)</th>
            <th className="py-3 px-4">Time (min)</th>
            <th className="py-3 px-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {rideHistory.length > 0 ? (
            rideHistory.map((ride) => (
              <tr
                key={ride._id}
                className={`border-b transition-colors duration-150 ${
                  variant === "admin"
                    ? "hover:bg-[#2B2F44] border-gray-700"
                    : "hover:bg-gray-50 border-gray-200"
                } cursor-pointer`}
                onClick={() => handleNavigation(ride._id)}
              >
                <td className="py-3 px-4">
                  {ride.startedAt ? formatDate(ride.startedAt) : "N/A"}
                </td>
                <td className="py-3 px-4">
                  {ride.pickupLocation.split(" ").slice(0, 3).join(" ")}
                </td>
                <td className="py-3 px-4">
                  {ride.dropOffLocation.split(" ").slice(0, 3).join(" ")}
                </td>
                <td className="py-3 px-4">{ride.totalFare.toFixed(2)}</td>

                {variant !== "user" && (
                  <>
                    <td className="py-3 px-4">
                      {ride.commission?.toFixed(2) ?? "-"}
                    </td>
                    <td className="py-3 px-4">
                      {ride.driverEarnings?.toFixed(2) ?? "-"}
                    </td>
                  </>
                )}

                <td className="py-3 px-4">
                  {(ride.distance / 1000).toFixed(2)} km
                </td>
                <td className="py-3 px-4">
                  {(ride.estTime / 60).toFixed(2)} min
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      ride.status === "completed"
                        ? variant === "admin"
                          ? "bg-green-900 text-green-300"
                          : "bg-green-100 text-green-700"
                        : ride.status === "cancelled"
                        ? variant === "admin"
                          ? "bg-red-900 text-red-300"
                          : "bg-red-100 text-red-700"
                        : variant === "admin"
                        ? "bg-yellow-900 text-yellow-300"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {ride.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={variant !== "user" ? 8 : 6}
                className={`text-center py-6 ${
                  variant === "admin" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                No rides found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RideHistoryTable;
