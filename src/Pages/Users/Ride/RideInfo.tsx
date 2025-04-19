import { getRideInfo } from "@/api/auth/user";
import NavBar from "@/components/user/NavBar";
import { useEffect, useState } from "react";
import { message } from "antd";

import { useLocation } from "react-router-dom";
export interface IRideDetails {
  _id: string;
  userId: string;
  driverId: {
    _id: string;
    name: string;
  };
  pickupLocation: string;
  pickupCoords: [number, number];
  dropOffLocation: string;
  dropOffCoords: number[];
  distance: number;
  estTime: number;
  totalFare: number;
  paymentStatus: "pending" | "completed" | "failed";
  status: "ongoing" | "completed" | "canceled";
  startedAt: number;
  endedAt?: number;
  cancelledAt?: number;
  __v?: number;
}

const RideInfo = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const location = useLocation();
  const rideId = location.state;
  const [rideInfo, setRideInfo] = useState<IRideDetails>();
  useEffect(() => {
    const fetchRideInfo = async () => {
      try {
        const res = await getRideInfo(rideId);
        if (res.ride) {
          console.log("Ride  ", res.ride);
          setRideInfo(res.ride);
        }
      } catch (error) {
        if (error instanceof Error) messageApi.error(error.message);
        else messageApi.error("Failed to fetch ride history");
      }
    };
    fetchRideInfo();
  }, [rideId,messageApi]);
  return (
    <div>
      {contextHolder}
      <NavBar />
      <p>{rideInfo ? rideInfo.totalFare : 'NO Data found'}</p>
    </div>
  );
};

export default RideInfo;
