import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStatus, updateRandomLoc } from "../../../api/auth/driver";
import DNavBar from "@/components/driver/DNavBar";
import { message } from "antd";
import MapComponent from "@/components/MapComp";
import { socket } from "@/utils/socket";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { IMessage } from "@/interfaces/chat.interface";
import ChatModal from "@/components/ChatModal";
import RideCancelModal from "@/components/RideCancelModal";
import RideInfoCard from "@/components/driver/RideInfoCard";
import { useDRide } from "@/hooks/useDRide";
import { setDCurrentLocInSlice } from "@/redux/slices/driverRideSlice";

export interface IRideReqInfo {
  user: { id: string; name: string };
  pickupCoords: [number, number];
  dropOffCoords: [number, number];
  pickupLocation: string;
  dropOffLocation: string;
  time?: number;
  distance?: number;
  fare: number;
}

export interface IDriverRoute {
  formattedRoute: [number, number][];
  time: number;
  distance: number;
  reachBy: Date;
}
const DRide = () => {
  const {
    messages,
    setMessages,
    setCurrentLoc,
    clearAllStateData,
    trackingToPickupRef,
  } = useDRide();

  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const driverId = useSelector(
    (state: RootState) => state.driverAuth.driver?._id
  );
  const dispatch = useDispatch();
  const [chatOn, setChatOn] = useState(false);
  const {
    driverRoute,
    isRideStarted,
    remainingRoute,
    routeCoords,
    rideReqInfo,
    ridePhase,
    dropOffCoords,
    pickupCoords,
    currentLoc,
  } = useSelector((state: RootState) => state.DRide);
  // To Fetch driver info and redirect
  useEffect(() => {
    let isMounted = true;

    const fetchStatus = async () => {
      try {
        const res = await getStatus();
        if (!isMounted) return;

        const { driverStatus, vehicleStatus } = res;
        if (driverStatus === "pending" || vehicleStatus === "pending")
          navigate("/driver/verification-pending");
        else if (driverStatus === "rejected") navigate("/driver/rejected");
        else if (vehicleStatus === "rejected")
          navigate("/driver/vehicle-rejected");
      } catch (error: unknown) {
        console.log("error from getStatus", error);
        localStorage.clear();
        navigate("/driver/login");
      }
    };

    fetchStatus();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  // To update to a new Random location
  const handleLocationUpdate = async () => {
    try {
      const res = await updateRandomLoc();
      if (res.success && res.coordinates) {
        messageApi.success("Updated a random location");
        console.log("current loc ", res.coordinates);
        dispatch(
          setDCurrentLocInSlice([res.coordinates[1], res.coordinates[0]])
        );
        setCurrentLoc([res.coordinates[1], res.coordinates[0]]);
      } else {
        messageApi.error("Failed to update a location");
      }
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        messageApi.error(error.message);
      } else {
        messageApi.error("Failed to update a location");
      }
    }
  };

  const cancelTheRide = () => {
    socket.emit("cancel-ride", "driver");
    setChatOn(false);
    clearAllStateData();
    socket.off("driver-location-update");
    if (trackingToPickupRef.current) {
      console.log("the interval has been cleared");
      clearInterval(trackingToPickupRef.current);
      trackingToPickupRef.current = null;
    }
  };
  const closeChat = () => {
    setChatOn(false);
  };

  const sendChatMsg = (text: string) => {
    if (!driverId) {
      return;
    }
    const newMessage: IMessage = {
      id: Date.now().toString(),
      text,
      senderId: driverId,
    };

    setMessages((prev) => [...prev, newMessage]);
    socket.emit("chat-msg", { text: text, sendBy: "driver" });
  };

  return (
    <>
      <DNavBar />
      {contextHolder}

      <ChatModal
        messages={messages}
        currentUserId={driverId}
        isOpen={chatOn}
        changeOpen={closeChat}
        submit={sendChatMsg}
      />

      {isCancelOpen && (
        <RideCancelModal
          cancelTheRide={cancelTheRide}
          isCancelOpen={isCancelOpen}
          rideInfo={rideReqInfo}
          setIsCancelOpen={setIsCancelOpen}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] mt-6 mx-5 gap-5 md:min-h-[calc(80vh-90px)] lg:min-h-[calc(100vh-90px)] overflow-x-auto">
        {/* Left Section - Info Card */}

        <RideInfoCard
          handleLocationUpdate={handleLocationUpdate}
          ridePhase={ridePhase}
          rideReqInfo={rideReqInfo}
          setChatOn={setChatOn}
          setIsCancelOpen={setIsCancelOpen}
          driverRoute={driverRoute}
        />

        <div className="w-full min-h-[400px] max-h-[80vh] z-0">
          <MapComponent
            pickupCoords={pickupCoords}
            dropOffCoords={dropOffCoords}
            routeCoords={routeCoords}
            driverLoc={currentLoc}
            isRideStarted={isRideStarted}
            driverRoute={
              isRideStarted ? remainingRoute : driverRoute?.formattedRoute
            }
          />
        </div>
      </div>
    </>
  );
};

export default DRide;
