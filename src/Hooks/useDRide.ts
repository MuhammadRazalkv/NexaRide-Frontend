import { DSocketContextTypes } from "@/context/driverSocketContext";
import { createContext, useContext } from "react";

export const DRideContext = createContext<DSocketContextTypes | undefined>(
  undefined
);

export const useDRide = () => {
  const context = useContext(DRideContext);
  if (context === undefined) {
    throw new Error("useRide must be used inside RideProvider");
  }
  return context;
};