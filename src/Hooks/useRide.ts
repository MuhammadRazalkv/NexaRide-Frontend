import { SocketContextTypes } from "@/context/SocketContext";
import { createContext, useContext } from "react";

export const RideContext = createContext<SocketContextTypes | undefined>(
  undefined
);

export const useRide = () => {
  const context = useContext(RideContext);
  if (context === undefined) {
    throw new Error("useRide must be used inside RideProvider");
  }
  return context;
};
