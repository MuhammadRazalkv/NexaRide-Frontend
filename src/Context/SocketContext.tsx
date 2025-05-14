import { useEffect, useState } from "react";
import { RideContext } from "@/hooks/useRide";
import { socket, connectSocket, RideInfo } from "@/utils/socket";
import {
  resetRide,
  setDriverArrivedInSlice,
  setInPaymentInSlice,
  setRideIdInSlice,
  setRemainingRouteInSlice,
  setRemainingDropOffRouteInSlice,
} from "@/redux/slices/rideSlice";

import { IMessage } from "@/interfaces/chat.interface";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { message } from "antd";
import { useDispatch } from "react-redux";
export interface SocketContextTypes {
  isRideStarted: boolean;
  setIsRideStarted: React.Dispatch<React.SetStateAction<boolean>>;
  setPaymentModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  messages: IMessage[];
  chatOn: boolean;
  setChatOn: React.Dispatch<React.SetStateAction<boolean>>;
  driverArrived: boolean;
  setDriverArrived: React.Dispatch<React.SetStateAction<boolean>>;
  paymentModalOpen: boolean;
  isRateModalOpen: boolean;
  setIsRateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
  rideId: string;
  setRideId: React.Dispatch<React.SetStateAction<string>>;
  rideInfo: RideInfo | null;
  setRideInfo: React.Dispatch<React.SetStateAction<RideInfo | null>>;
  clearAllStateDataInContext: () => void;
  rideGotCancelled: boolean;
}

export const RideProvider = ({ children }: { children: React.ReactNode }) => {
  const [isRideStarted, setIsRideStarted] = useState(false);
  const [rideInfo, setRideInfo] = useState<RideInfo | null>(null);

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [chatOn, setChatOn] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [rideId, setRideId] = useState("");
  const token = useSelector((state: RootState) => state.auth.token);

  const [driverArrived, setDriverArrived] = useState(false);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [rideGotCancelled, setRideGotCancelled] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();

  const clearAllStateDataInContext = () => {
    setIsRideStarted(false);
    setRideInfo(null);
    setMessages([]);
    setChatOn(false);
    setPaymentModalOpen(false);
    setRideId("");
    setDriverArrived(false);
    setIsRateModalOpen(false);
    setRideGotCancelled(false);
  };

  // socket listeners
  useEffect(() => {
    if (!token) return;
    connectSocket(token, "user");

    const handleChat = (data: IMessage) => {
      setMessages((prev) => [...prev, data]);
    };

    const handleRideCancelled = async () => {
      messageApi.error("The ride was cancelled by the driver");
      clearAllStateDataInContext();
      dispatch(resetRide());
      setRideGotCancelled(true);
      socket.off("driver-location-update");
    };

    const handleDriverReached = async () => {
      messageApi.success(
        "Driver reached your location please share your otp to start the ride"
      );
      setDriverArrived(true);
      dispatch(setDriverArrivedInSlice(true));
      dispatch(setRemainingRouteInSlice([]));
    };

    const handleDropOffReached = async (data: {
      rideId: string;
      fare: number;
    }) => {
      setPaymentModalOpen(true);

      setRideId(data.rideId);
      dispatch(setRideIdInSlice(data.rideId));
      dispatch(setInPaymentInSlice(true));
      dispatch(setRemainingDropOffRouteInSlice([]));
    };

    const handlePaymentSuccess = async () => {
      setIsRateModalOpen(true);
      messageApi.success("Payment success");
      // dispatch(setRideIdInSlice(""));
      dispatch(setInPaymentInSlice(false));
      setPaymentModalOpen(false);
      setIsRateModalOpen(true);
      // setRideId(undefined);
      setChatOn(false);
      // clearAllStateData();
    };
    const handleError = async ({ message }: { message: string }) => {
      console.log(message);

      messageApi.error(message);
    };
    socket.on("ride-error", handleError);
    socket.on("driver-reached", handleDriverReached);
    socket.on("ride-cancelled", handleRideCancelled);
    socket.on("dropOff-reached", handleDropOffReached);
    socket.on("payment-success", handlePaymentSuccess);
    socket.on("chat-msg", handleChat);
    return () => {
      socket.off("chat-msg", handleChat);
    };
  }, [token, messageApi, dispatch]);

  return (
    <RideContext.Provider
      value={{
        setRideInfo,
        setRideId,
        setMessages,
        setIsRateModalOpen,
        setPaymentModalOpen,
        setChatOn,
        setIsRideStarted,
        clearAllStateDataInContext,
        setDriverArrived,
        rideGotCancelled,
        rideInfo,
        rideId,
        isRideStarted,
        driverArrived,
        isRateModalOpen,
        paymentModalOpen,
        messages,
        chatOn,
      }}
    >
      {contextHolder}
      {children}
    </RideContext.Provider>
  );
};
