// src/hooks/useDriverSocketEvents.ts
import { useEffect } from "react";
import { socket, connectSocket, ServerToClientEvents } from "@/utils/socket";
import { IMessage } from "@/interfaces/chat.interface";
import { AppDispatch } from "@/redux/store";
import { setRideIdInSlice } from "@/redux/slices/rideSlice";
import { message } from "antd";
import { IRideReqInfo } from "@/pages/driver/ride/DRide";
import { getLocationFromCoords, getRouteDetails } from "@/utils/geoApify";

type NewRideReqData = Parameters<ServerToClientEvents["new-ride-req"]>[0];

interface Props {
  token?: string | null;
  setRideReqInfo: (info: IRideReqInfo) => void;
  setIsDialogOpen: (b: boolean) => void;
  setIsRateModalOpen: (b: boolean) => void;
  setWaitPayment: (b: boolean) => void;
  setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
  dispatch: AppDispatch;
  messageApi: ReturnType<typeof message.useMessage>[0];
}

export const useDriverSocketEvents = ({
  token,
  setRideReqInfo,
  setIsDialogOpen,
  setIsRateModalOpen,
  setWaitPayment,
  setMessages,
  dispatch,
  messageApi,
}: Props) => {
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

        setRideReqInfo(updatedRideReqInfo);
        setIsDialogOpen(true);
      } catch (err) {
        console.error("Error during ride req:", err);
        messageApi.error("Failed to fetch ride details.");
      }
    };

    const handlePaymentReceived = () => {
      messageApi.success("Payment received");
      setIsRateModalOpen(true);
      setWaitPayment(false);
    };

    const handleChat = (data: IMessage) => {
      messageApi.info("You have a new message");
      setMessages((prev) => [...prev, data]);
    };

    const handleRideCancelled = () => {
      messageApi.error("Ride cancelled by user");
      dispatch(setRideIdInSlice(""));
      socket.off("driver-location-update");
    };

    socket.on("new-ride-req", handleNewRideReq);
    socket.on("payment-received", handlePaymentReceived);
    socket.on("chat-msg", handleChat);
    socket.on("ride-cancelled", handleRideCancelled);

    return () => {
      socket.off("new-ride-req", handleNewRideReq);
      socket.off("payment-received", handlePaymentReceived);
      socket.off("chat-msg", handleChat);
      socket.off("ride-cancelled", handleRideCancelled);
    };
  }, [
    token,
    setRideReqInfo,
    setIsDialogOpen,
    setIsRateModalOpen,
    setWaitPayment,
    setMessages,
    dispatch,
    messageApi,
  ]);
};
