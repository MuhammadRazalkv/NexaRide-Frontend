import { useEffect, useRef } from "react";
import { socket, connectSocket, ServerToClientEvents } from "@/utils/socket";
import { IMessage } from "@/interfaces/chat.interface";
import { AppDispatch } from "@/redux/store";
import { setRideIdInSlice } from "@/redux/slices/rideSlice";
import { message } from "antd";
import { IRideReqInfo } from "@/pages/driver/ride/DRide";
import { getLocationFromCoords, getRouteDetails } from "@/utils/geoApify";
import { openPaymentModal } from "@/redux/slices/driverRideSlice";

type NewRideReqData = Parameters<ServerToClientEvents["new-ride-req"]>[0];

interface Props {
  token?: string | null;
  setRideReqData: (info: IRideReqInfo | undefined) => void;
  setIsDialogOpen: (b: boolean) => void;
  setIsRateModalOpen: (b: boolean) => void;
  // setWaitPayment: (b: boolean) => void;
  setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
  dispatch: AppDispatch;
  rideRejected: boolean;
  isRideStarted: boolean;
  messageApi: ReturnType<typeof message.useMessage>[0];
  clearAllStateData: () => void;
  trackingToPickupRef: React.MutableRefObject<NodeJS.Timeout | null>;
}

export const useDriverSocketEvents = ({
  token,
  setRideReqData,
  setIsDialogOpen,
  setIsRateModalOpen,
  // setWaitPayment,
  setMessages,
  dispatch,
  rideRejected,
  isRideStarted,
  messageApi,
  clearAllStateData,
  trackingToPickupRef,
}: Props) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!token) return;
    connectSocket(token, "driver");

    const handleNewRideReq = async (data: NewRideReqData) => {
      try {
        const [pickupLocation, dropOffLocation, timeAndDistance] =
          await Promise.all([
            getLocationFromCoords(data.pickupCoords),
            getLocationFromCoords(data.dropOffCoords),
            getRouteDetails(data.pickupCoords, data.dropOffCoords),
          ]);

        const updatedRideReqInfo = {
          ...data,
          pickupLocation:
            pickupLocation.address_line1 + pickupLocation.address_line2,
          dropOffLocation:
            dropOffLocation.address_line1 + dropOffLocation.address_line2,
          ...timeAndDistance,
        };

        setRideReqData(updatedRideReqInfo);
        setIsDialogOpen(true);

        timeoutRef.current = setTimeout(() => {
          if (!rideRejected && !isRideStarted) {
            console.log("Driver did not respond within timeout.");
            setRideReqData(undefined);
            setIsDialogOpen(false);
            //  socket.emit("no-response", rideReqUserIdRef.current);
          }
        }, 15000);
      } catch (err) {
        console.error("Error during ride req:", err);
        messageApi.error("Failed to fetch ride details.");
      }
    };

    const handlePaymentReceived = () => {
      messageApi.success("Payment received");
      setIsRateModalOpen(true);
      // setWaitPayment(false);
      dispatch(openPaymentModal(false));
      // clearAllStateData();
    };

    const handleChat = (data: IMessage) => {
      messageApi.info("You have a new message");
      setMessages((prev) => [...prev, data]);
    };

    const handleRideCancelled = () => {
      messageApi.error("Ride cancelled by user");
      dispatch(setRideIdInSlice(""));
      clearAllStateData();
      socket.off("driver-location-update");
      if (trackingToPickupRef.current) {
        console.log("the interval has been cleared");
        clearInterval(trackingToPickupRef.current);
        trackingToPickupRef.current = null;
      }
    };

    socket.on("new-ride-req", handleNewRideReq);
    socket.on("payment-received", handlePaymentReceived);
    socket.on("chat-msg", handleChat);
    socket.on("ride-cancelled", handleRideCancelled);
    const interval = setInterval(() => {
      if (socket.connected) {
        socket.emit("keep-alive");
      }
    }, 60000);
    return () => {
      socket.off("new-ride-req", handleNewRideReq);
      socket.off("payment-received", handlePaymentReceived);
      socket.off("chat-msg", handleChat);
      socket.off("ride-cancelled", handleRideCancelled);
      clearInterval(interval);
    };
  }, [
    token,
    setRideReqData,
    setIsDialogOpen,
    setIsRateModalOpen,
    // setWaitPayment,
    setMessages,
    dispatch,
    isRideStarted,
    rideRejected,
    messageApi,
    clearAllStateData,
    trackingToPickupRef,
  ]);

  useEffect(() => {
    if (rideRejected || isRideStarted) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  }, [rideRejected, isRideStarted]);
};
