import { createContext, useEffect, useState, useContext } from "react";
import {
  socket,
  RideInfo,
  connectSocket,
  // disconnectSocket,
} from "@/utils/socket";
import { setInPayment, setRideIdInSlice } from "@/redux/slices/rideSlice";

import { IMessage } from "@/interfaces/chat.interface";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { message } from "antd";
import { useDispatch } from "react-redux";
interface SocketContextTypes {
  // socket : typeof socket;
  // pickupCoords: [number, number] | undefined;
  // setPickupCoords: React.Dispatch<
  //   React.SetStateAction<[number, number] | undefined>
  // >;
  // dropOffCoords: [number, number] | undefined;
  // setDropOffCoords: React.Dispatch<
  //   React.SetStateAction<[number, number] | undefined>
  // >;
  // Add all the other states you need here...
  rideInfo: RideInfo | null;
  isRideStarted: boolean;
  // driverLiveLocation?: [number, number];
  messages: IMessage[];
  chatOn: boolean;
  // sendRideReq: boolean;
  driverArrived:boolean;
  paymentModalOpen:boolean;
  isRateModalOpen:boolean
  // ... any others you want globally
}

const RideContext = createContext<SocketContextTypes | undefined>(undefined);

export const RideProvider = ({ children }: { children: React.ReactNode }) => {
  // const [pickupCoords, setPickupCoords] = useState<[number, number]>();
  // const [dropOffCoords, setDropOffCoords] = useState<[number, number]>();
  const [rideInfo, setRideInfo] = useState<RideInfo | null>(null);
  const [isRideStarted, setIsRideStarted] = useState(false);
  // const [driverLiveLocation, setDriverLiveLocation] = useState<[number, number]>();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [chatOn, setChatOn] = useState(false);
  // const [sendRideReq, setSendRideReq] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const token = useSelector((state: RootState) => state.auth.token);

  const [driverArrived, setDriverArrived] = useState(false);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch()

  // socket listeners here
  useEffect(() => {
    if (!token) return;
    connectSocket(token, "user");

    const handleRideAccepted = (data: RideInfo) => {
      setRideInfo(data);
      setIsRideStarted(true);
    };

    // const handleDriverLocationUpdate = (data: {
    //   location: [number, number];
    // }) => {
    //   setDriverLiveLocation(data.location);
    // };

    const handleChat = (data: IMessage) => {
      setMessages((prev) => [...prev, data]);
    };

    const handleRideCancelled = async () => {
      messageApi.error("The ride was cancelled by the driver");
      socket.off("driver-location-update");
    };

    const handleDriverReached = async () => {
      messageApi.success(
        "Driver reached your location please share your otp to start the ride"
      );
      setDriverArrived(true);

    };

    const handleDropOffReached = async (data: {
      rideId: string;
      fare: number;
    }) => {
      setPaymentModalOpen(true);
      // setRideId(data.rideId);
      dispatch(setRideIdInSlice(data.rideId));
      dispatch(setInPayment(true));
    };

    const handlePaymentSuccess = async () => {
      setIsRateModalOpen(true);
      messageApi.success("Payment success");
      // dispatch(setRideIdInSlice(""));
      dispatch(setInPayment(false));
      setPaymentModalOpen(false);
      setIsRateModalOpen(true);
      // setRideId(undefined);
      setChatOn(false);
      // clearAllStateData();
    };

    socket.on("ride-accepted", handleRideAccepted);
    // socket.on("driver-location-update", handleDriverLocationUpdate);

    socket.on("driver-reached", handleDriverReached);
    socket.on("ride-cancelled", handleRideCancelled);
    socket.on("dropOff-reached", handleDropOffReached);
    socket.on("payment-success", handlePaymentSuccess);
    socket.on("chat-msg", handleChat);
    return () => {
      socket.off("ride-accepted", handleRideAccepted);
      // socket.off("driver-location-update", handleDriverLocationUpdate);
      socket.off("chat-msg", handleChat);
    };
  }, [token,messageApi,dispatch]);

  return (
    <RideContext.Provider
      value={{
     
        rideInfo,
        isRideStarted,
        driverArrived,
        isRateModalOpen,
        paymentModalOpen,
        
        messages,
        chatOn,
        // sendRideReq,
      }}
    >
      {contextHolder}
      {children}
    </RideContext.Provider>
  );
};

export const useRide = () => {
  const context = useContext(RideContext);
  if (context === undefined) {
    throw new Error("useRide must be used inside RideProvider");
  }
  return context;
};
