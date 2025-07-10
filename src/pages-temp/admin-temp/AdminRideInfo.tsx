import { adminRideInfo } from "@/api/auth/admin";
import AdminNavBar from "@/components/admin/AdminNavbar";
import RideInfoTable from "@/components/RideInfoTable";
import { IRideHistoryItem } from "@/interfaces/fullRideInfo.interface";
import { message } from "antd";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const AdminRideInfo = () => {
  const location = useLocation();
  const rideId = location.state;
  const [rideInfo, setRideInfo] = useState<IRideHistoryItem | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchRideInfo = async () => {
      setLoading(true);
      try {
        const res = await adminRideInfo(rideId);
        if (res.success && res.rideInfo) {
          setRideInfo(res.rideInfo);
        }
      } catch (error) {
        if (error instanceof Error) message.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRideInfo();
  }, [rideId]);

  return (
    <div className="bg-[#0E1220] min-h-screen p-4 ">
      <AdminNavBar />
      <RideInfoTable loading={loading} rideInfo={rideInfo} variant="admin" />
    </div>
  );
};

export default AdminRideInfo;
