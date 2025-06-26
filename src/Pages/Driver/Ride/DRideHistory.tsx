import { getRideHistory } from "@/api/auth/driver";
import DNavBar from "@/components/driver/DNavBar";
import { useEffect, useState } from "react";
import { message } from "antd";
import RideHistoryTable from "@/components/RideHistoryTable";
import { Pagination } from "antd";
import { useNavigate } from "react-router-dom";
import { IRideHistoryItem } from "@/interfaces/fullRideInfo.interface";
//  interface IRideHistoryItem {
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
//   paymentStatus: "completed" | "pending" | "failed";
//   driverId: string;
//   userId: string;
//   driverEarnings: number;
//   commission: number;
// }

const DRideHistory = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [rideHistory, setRideHistory] = useState<IRideHistoryItem[]>([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState<"new" | "old">("new");

  useEffect(() => {
    async function fetchRideHistory() {
      try {
        const res = await getRideHistory(sort,currentPage);
        if (res.success && res.history && res.total) {
          setRideHistory(res.history);
          setTotal(res.total);
        }
      } catch (error) {
        console.log(error);
        messageApi.error("Failed to fetch ride history");
      }
    }
    fetchRideHistory();
  }, [messageApi, currentPage, sort]);

  const handleNavigation = (id: string) => {
    navigate("/driver/rideInfo", { state: id });
  };
  return (
    <>
      <DNavBar />
      {contextHolder}

      <div className="px-4 md:px-12 py-6 space-y-2">
        <h2 className="text-2xl font-semibold mb-4">Your Ride History</h2>
           <div className="flex items-center gap-3 w-full sm:w-auto">
          <label htmlFor="sort" className="font-medium">
            Sort by date:
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as "new" | "old")}
            className=" border border-gray-600 rounded-md px-4 py-1 outline-none"
          >
            <option value="new">Newest First </option>
            <option value="old">Oldest First</option>
          </select>
        </div>
        <RideHistoryTable
          rideHistory={rideHistory}
          variant="driver"
          handleNavigation={handleNavigation}
        />
        <Pagination
          current={currentPage}
          total={total}
          pageSize={8}
          align="center"
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </>
  );
};

export default DRideHistory;
