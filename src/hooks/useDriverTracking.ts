import { AppDispatch } from "@/redux/store";
import { DriverTrackingService } from "@/services/DriverTrackingService";
import { AppSocket } from "@/utils/socket";
import { MessageInstance } from "antd/es/message/interface";
import { useRef, useEffect } from "react";

//* This hook is used to create a instance for the driver tracing system to be used in the driverSocketContext

export const useDriverTrackingService = (
  socket: AppSocket,
  dispatch: AppDispatch,
  messageApi: MessageInstance
) => {
  const serviceRef = useRef<DriverTrackingService>();

  if (!serviceRef.current) {
    serviceRef.current = new DriverTrackingService(
      socket,
      dispatch,
      messageApi
    );
  }

  useEffect(() => {
    return () => {
      serviceRef.current?.stop(); // cleanup
    };
  }, []);

  return serviceRef.current;
};
