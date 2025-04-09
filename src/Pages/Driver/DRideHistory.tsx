import { getRideHistory } from "@/api/auth/driver";
import DNavBar from "@/components/driver/DNavBar";
import { useEffect, useState } from "react";
import { message } from "antd";

export interface IRideHistoryItem {
  _id: string;
  pickupLocation: string;
  dropOffLocation: string;
  totalFare: number;
  distance: number;
  estTime: number;
  timeTaken?: number;
  status: "completed" | "cancelled" | "ongoing";
  startedAt?: number;
  endedAt?: number;
  canceledAt?: number;
  paymentStatus: "completed" | "pending" | "failed";
  driverId: string;
  userId:string;
  driverEarnings:number;
  commission:number;
}

const DRideHistory = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [rideHistory, setRideHistory] = useState<IRideHistoryItem[]>([]);

  useEffect(() => {
    async function fetchRideHistory() {
      try {
        const res = await getRideHistory();
        if (res.success && res.history) {
          setRideHistory(res.history);
        }
      } catch (error) {
        console.log(error);
        messageApi.error("Failed to fetch ride history");
      }
    }
    fetchRideHistory();
  }, [messageApi]);

  return (
    <>
      <DNavBar />
      {contextHolder}

      <div className="px-4 md:px-12 py-6">
        <h2 className="text-2xl font-semibold mb-4">Your Ride History</h2>
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full table-auto text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-900 uppercase text-xs">
              <tr>
                <th className="py-3 px-4">Pickup</th>
                <th className="py-3 px-4">Drop-off</th>
                <th className="py-3 px-4">Total Fare (₹)</th>
                <th className="py-3 px-4">App Fee (₹)</th>
                <th className="py-3 px-4">Your Fare (₹)</th>
                <th className="py-3 px-4">Distance (km)</th>
                <th className="py-3 px-4">Time (min)</th>
                <th className="py-3 px-4">Status</th>
                {/* <th className="py-3 px-4">Payment</th> */}
              </tr>
            </thead>
            <tbody>
              {rideHistory.length > 0 ? (
                rideHistory.map((ride) => (
                  <tr key={ride._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {ride.pickupLocation.split(" ").slice(0, 3).join(" ")}
                    </td>
                    <td className="py-3 px-4">
                      {ride.dropOffLocation.split(" ").slice(0, 3).join(" ")}
                    </td>

                    <td className="py-3 px-4">{ride.totalFare.toFixed(2)}</td>
                    <td className="py-3 px-4">{ride.commission}</td>
                    <td className="py-3 px-4">{ride.driverEarnings}</td>  

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
                            ? "bg-green-100 text-green-700"
                            : ride.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {ride.status}
                      </span>
                    </td>
                    {/* <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          ride.paymentStatus === "completed"
                            ? "bg-green-200 text-green-800"
                            : ride.paymentStatus === "failed"
                            ? "bg-red-200 text-red-800"
                            : "bg-yellow-200 text-yellow-800"
                        }`}
                      >
                        {ride.paymentStatus}
                      </span>
                    </td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    No rides found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DRideHistory;
