import {
  setDDropOffIndex,
  setDPickupIndex,
  openOTPModal,
  openPaymentModal,
  setInPayment,
} from "@/redux/slices/driverRideSlice";
import { AppDispatch } from "@/redux/store";
import { AppSocket } from "@/utils/socket";
import { MessageInstance } from "antd/es/message/interface";
export type TrackingPhase = "toPickup" | "toDropOff";

export class DriverTrackingService {
  private interval: NodeJS.Timeout | null = null;

  constructor(
    private socket: AppSocket,
    private dispatch: AppDispatch,
    private messageApi: MessageInstance
  ) {}

  start(
    routeCoords: [number, number][],
    currentIndex: number,
    phase: TrackingPhase,
    setCurrLoc: React.Dispatch<
      React.SetStateAction<[number, number] | undefined>
    >
  ) {
    this.stop();

    this.interval = setInterval(() => {
      if (currentIndex < routeCoords.length) {
        const currentLocation = routeCoords[currentIndex];
        console.log(`sending [${phase}] `, currentLocation);

        this.socket.emit("driver-location-update", {
          type: phase,
          location: currentLocation,
        });

        setCurrLoc(currentLocation);
        if (phase == "toPickup") {
          this.dispatch(setDPickupIndex(currentIndex + 1));
        } else {
          this.dispatch(setDDropOffIndex(currentIndex + 1));
        }
        currentIndex++;
      } else {
        this.stop();
        setCurrLoc(undefined)
        
        if (phase === "toPickup") {
          this.socket.emit("driver-reached");
          this.dispatch(openOTPModal(true));
          this.dispatch(setDPickupIndex(0));
          this.messageApi.success("Driver has reached the pickup location.");
        } else if (phase === "toDropOff") {
          this.socket.emit("dropOff-reached");
          this.dispatch(openPaymentModal(true));
          this.dispatch(setDDropOffIndex(0));
          this.dispatch(setInPayment(true))
          this.messageApi.success("Ride complete! Please proceed to payment.");
        }
      }
    }, 1000);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.socket.off("driver-location-update");
  }
}
