import {
  fetchCurrentStoredLocation,
  giveFeedbackDriver,
  verifyRideOTP,
} from "@/api/auth/driver";
import RideOTPModal from "@/components/driver/RideOTPModal";
import RideReqModal from "@/components/driver/RideReqModal";
import RatingModal from "@/components/RatingModal";
import WaitingModal from "@/components/user/WaitingModal";
import { DRideContext } from "@/hooks/useDRide";
import { useDriverSocketEvents } from "@/hooks/useDriverSocketEvents";
import { IMessage } from "@/interfaces/chat.interface";
import { IDriverRoute, IRideReqInfo } from "@/pages/driver/ride/DRide";
import {
  openOTPModal,
  openPaymentModal,
  resetDriverRideInSlice,
  setDCurrentLocInSlice,
  setDDriverRouteInSlice,
  setDDropOffCoordsInSlice,
  setDIsRideStartedInSlice,
  setDPickupCoordsInSlice,
  setDRemainingRouteInSlice,
  setDRideIdInSlice,
  setDRidePhaseInSlice,
  setDRideReqInfoInSlice,
  setDRouteCoordsInSlice,
} from "@/redux/slices/driverRideSlice";
import { RootState } from "@/redux/store";
import { fetchRoute } from "@/utils/geoApify";
import { socket } from "@/utils/socket";
import { message } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export interface DSocketContextTypes {
  // rideReqInfo?: IRideReqInfo;
  pickupCoords: [number, number] | null;
  dropOffCoords: [number, number] | null;
  // routeCoords?: [number, number][];
  // driverRoute?: IDriverRoute;
  // remainingRoute?: [number, number][];
  // isRideStarted: boolean;
  // ridePhase: "idle" | "toPickup" | "otpVerified" | "toDropOff";
  currentLoc?: [number, number];
  messages: IMessage[];
  setCurrentLoc: React.Dispatch<
    React.SetStateAction<[number, number] | undefined>
  >;
  setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
  clearAllStateData: () => void;
  trackingToPickupRef: React.MutableRefObject<NodeJS.Timeout | null>;
}
// type NewRideReqData = Parameters<ServerToClientEvents["new-ride-req"]>[0];

export const DRideProvider = ({ children }: { children: React.ReactNode }) => {
  const token = useSelector((state: RootState) => state.driverAuth.token);
  const [rideReqData, setRideReqData] = useState<IRideReqInfo>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const [isRideStarted, setIsRideStarted] = useState(false);
  // const [ridePhase, setRidePhase] = useState<
  //   "idle" | "toPickup" | "otpVerified" | "toDropOff"
  // >("idle");
  const [pickupCoords, setPickupCoords] = useState<[number, number] | null>(
    null
  );
  const [dropOffCoords, setDropOffCoords] = useState<[number, number] | null>(
    null
  );

  //* This is the path of from the pickup point to the drop off point
  // const [routeCoords, setRouteCoords] = useState<
  //   [number, number][] | undefined
  // >([]);
  // const [driverArrived, setDriverArrived] = useState(false);

  //* This is the info from driver to the pickup path , time and distance
  // const [driverRoute, setDriverRoute] = useState<IDriverRoute | undefined>(
  //   undefined
  // );
  //* This is the updated driver to pickup route (gets updated when the driver starts the ride to pickup)
  // const [remainingRoute, setRemainingRoute] = useState<
  //   [number, number][] | undefined
  // >([]);

  //* Drivers current location
  const [currentLoc, setCurrentLoc] = useState<[number, number] | undefined>(
    undefined
  );
  // const [otpDialog, setOtpDialog] = useState(false);
  const [OTPError, setOTPError] = useState("");

  const [messageApi, contextHolder] = message.useMessage();
  // const [waitPayment, setWaitPayment] = useState(false);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewComments, setReviewComments] = useState("");
  const [ratingErr, setRatingError] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [rideRejected, setRideRejected] = useState(false);
  const trackingToPickupRef = useRef<NodeJS.Timeout | null>(null);
  const [firstRender, setFirstRender] = useState(true);
  const {
    isRideStarted,
    routeCoords,
    OTPModal,
    paymentModal,
    rideId,
    ridePhase,
    driverRoute,
    remainingRoute,
  } = useSelector((state: RootState) => state.DRide);
  // const remainingRoute = useSelector(
  //   (state: RootState) => state.DRide.remainingRoute
  // );
  const dispatch = useDispatch();

  const clearAllStateData = () => {
    // setRideReqInfo(undefined);
    setIsDialogOpen(false);
    // setIsRideStarted(false);
    // setRidePhase("idle");
    setPickupCoords(null);
    setDropOffCoords(null);
    // setRouteCoords([]);
    // setDriverRoute(undefined);
    // setRemainingRoute([]);
    setCurrentLoc(undefined);
    // setOtpDialog(false);
    setOTPError("");
    // setWaitPayment(false);
    setIsRateModalOpen(false);
    setRating(0);
    setReviewComments("");
    setRatingError("");
    setMessages([]);
    setRideRejected(false);
    dispatch(resetDriverRideInSlice());
  };

  useDriverSocketEvents({
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
  });

  const simulatedLiveTrackingToPickUp = useCallback(
    (driverRoute: IDriverRoute) => {
      let currentIndex = 0;
      setCurrentLoc(undefined);

      const interval = setInterval(() => {
        if (currentIndex < driverRoute.formattedRoute.length) {
          const currentLocation = driverRoute.formattedRoute[currentIndex];
          console.log("sending ", currentLocation);

          socket.emit("driver-location-update", {
            type: "toPickup",
            location: currentLocation,
          });

          // Update the remaining route only after ride starts

          // setRemainingRoute((prevRoute) => {
          //   if (prevRoute) {
          //     return prevRoute.slice(1);
          //   }
          // });

          dispatch(
            setDRemainingRouteInSlice(
              driverRoute.formattedRoute.slice(currentIndex + 1)
            )
          );

          currentIndex++;
        } else {
          console.log("Inside the else of the pickup");

          clearInterval(interval);
          // messageApi.success("Driver has reached the pickup location.");
          socket.off("driver-location-update");
          // setRemainingRoute(undefined);
          dispatch(setDRemainingRouteInSlice(undefined));
          socket.emit("driver-reached");
          // setOtpDialog(true);
          dispatch(openOTPModal(true));
          setTimeout(() => {
            messageApi.success("Driver has reached the pickup location.");
          }, 0);
        }
      }, 1000);
      trackingToPickupRef.current = interval;
      return () => clearInterval(interval);
    },
    [messageApi, dispatch]
  );

  const simulatedLiveTrackingToDropOff = useCallback(
    (routeCoords: [number, number][]) => {
      console.log(" route coords ", routeCoords);

      let currentIndex = 0;
      setCurrentLoc(undefined);

      const interval = setInterval(() => {
        if (currentIndex < routeCoords.length) {
          const currentLocation = routeCoords[currentIndex];
          console.log('sending location ',currentLocation);
          
          socket.emit("driver-location-update", {
            type: "toDropOff",
            location: currentLocation,
          });
          // setCurrentLoc(currentLocation);

          // Update the remaining route only after ride starts
          // setRemainingDropOffRoute((prevRoute) => prevRoute.slice(1));
          // setRouteCoords((prevRoute) => {
          //   if (prevRoute) {
          //     return prevRoute.slice(1);
          //   }
          // });
          dispatch(setDRouteCoordsInSlice(routeCoords.slice(currentIndex + 1)));
          currentIndex++;
        } else {
          clearInterval(interval);
          // messageApi.success("Driver has reached the drop off location.");
          socket.emit("dropOff-reached");
          socket.off("driver-location-update");
          console.log("waitPayment value:");

          // setWaitPayment(true);
          dispatch(openPaymentModal(true));
          console.log("waitPayment value changed to true ");

          // setTimeout(() => {
          message.success("Driver has reached the drop off location.");
          // }, 0);
        }
      }, 1000);

      return () => clearInterval(interval);
    },
    [dispatch]
  );

  useEffect(() => {
    if (!firstRender) return;

    if (isRideStarted) {
      if (ridePhase == "toPickup" && remainingRoute?.length && driverRoute) {
        simulatedLiveTrackingToPickUp({
          formattedRoute: remainingRoute,
          distance: driverRoute?.distance,
          reachBy: driverRoute?.reachBy,
          time: driverRoute?.time,
        });
      } else if (ridePhase == "toDropOff" && routeCoords?.length) {
        simulatedLiveTrackingToDropOff(routeCoords);
      }
    }
    setFirstRender(false);
  }, [
    isRideStarted,
    driverRoute,
    routeCoords,
    remainingRoute,
    ridePhase,
    firstRender,
    simulatedLiveTrackingToPickUp,
    simulatedLiveTrackingToDropOff,
  ]);

  // useEffect(() => {
  //   if (driverRoute && !isRideStarted) {
  //     // setRemainingRoute(driverRoute.formattedRoute);
  //     console.log(
  //       "Setting the case where ride is not stared but driver route is there"
  //     );

  //     dispatch(setDRemainingRouteInSlice(driverRoute.formattedRoute));
  //   } else if (driverRoute && isRideStarted) {
  //     console.log("Driver route ", driverRoute);
  //     console.log("this is the useEffect causing error ");

  //     // setRemainingRoute(driverRoute.formattedRoute);
  //     dispatch(setDRemainingRouteInSlice(driverRoute.formattedRoute));
  //     simulatedLiveTrackingToPickUp(driverRoute);
  //   }
  // }, [driverRoute, isRideStarted, simulatedLiveTrackingToPickUp, dispatch]);

  // Accept the ride

  const acceptRide = async (
    userId: string,
    pickupLocation: string,
    dropOffLocation: string,
    distance: number,
    time: number,
    fare: number,
    pickupCoords: [number, number],
    dropOffCoords: [number, number]
  ) => {
    if (!token) {
      messageApi.error("Token missing. Please ensure you are logged in.");
      return;
    }

    // Notify backend
    socket.emit("driver-ride-accepted", {
      token,
      userId,
      pickupLocation,
      dropOffLocation,
      distance,
      time,
      fare,
      pickupCoords,
      dropOffCoords,
    });

    // Update local state
    dispatch(setDRideReqInfoInSlice(rideReqData));
    // setRidePhase("toPickup");
    dispatch(setDRidePhaseInSlice("toPickup"));
    setPickupCoords(pickupCoords);
    dispatch(setDPickupCoordsInSlice(pickupCoords));
    setDropOffCoords(dropOffCoords);
    dispatch(setDDropOffCoordsInSlice(dropOffCoords));

    // Get current location
    const location = await fetchCurrentStoredLocation();
    if (!location.success || !location.location) {
      message.error("Failed to fetch driver location");
      return;
    }

    setCurrentLoc(location.coordinates);
    dispatch(setDCurrentLocInSlice(location.coordinates));

    // Fetch route to pickup
    const driverRouteInfo = await fetchRoute(location.location, pickupCoords);
    if (!driverRouteInfo) {
      message.error("Failed to calculate driver route");
      return;
    }

    const reachBy = new Date(Date.now() + driverRouteInfo.time * 1000);
    const fullDriverRoute = { ...driverRouteInfo, reachBy };

    dispatch(setDDriverRouteInSlice(fullDriverRoute));
    dispatch(setDRemainingRouteInSlice(fullDriverRoute.formattedRoute));

    // Fetch route from pickup to drop-off
    const routeCoordsRes = await fetchRoute(
      [pickupCoords[1], pickupCoords[0]],
      dropOffCoords
    );

    if (routeCoordsRes && routeCoordsRes.formattedRoute) {
      // setRouteCoords(routeCoordsRes.formattedRoute);
      dispatch(setDRouteCoordsInSlice(routeCoordsRes.formattedRoute));
    } else {
      messageApi.error("Failed to calculate drop-off route");
    }

    dispatch(setDIsRideStartedInSlice(true));
    simulatedLiveTrackingToPickUp(fullDriverRoute);
  };

  // Reject the ride
  const rejectRide = async (userId: string) => {
    try {
      setRideReqData(undefined);
      setRideRejected(true);
      socket.emit("reject-ride", userId);
    } catch (error) {
      console.log(error);
      messageApi.error("Failed to reject ride ");
    }
  };

  const handleOTPSubmit = async (OTP: string | null) => {
    if (!OTP) {
      return;
    }
    try {
      const response = await verifyRideOTP(OTP);
      if (response.success && response.rideId) {
        dispatch(openOTPModal(false));
        dispatch(setDRidePhaseInSlice("toDropOff"));
        dispatch(setDRideIdInSlice(response.rideId));
        if (routeCoords) {
          simulatedLiveTrackingToDropOff(routeCoords);
        }
      } else {
        setOTPError("Wrong OTP");
      }
    } catch (error) {
      if (error instanceof Error) {
        setOTPError(error.message);
      } else {
        setOTPError("Unexpected error occurred ");
      }
    }
  };
  const handleRating = (rating: number) => {
    setRating(rating);
  };
  const handleReviewComments = (value: string) => {
    setReviewComments(value.trim());
  };
  const closeReviewModal = () => {
    setIsRateModalOpen(false);
    clearAllStateData();
    // dispatch(setDRideIdInSlice(""));
  };

  const submitReview = async () => {
    setRatingError("");
    if (!rating) {
      setRatingError("Please give a rating");
      return;
    }
    if (reviewComments.length > 0 && reviewComments.length < 5) {
      setRatingError("Please enter minimum five characters");
      return;
    }
    if (!rideId) {
      messageApi.error("Ride id not found");
      return;
    }

    try {
      const res = await giveFeedbackDriver(rideId, rating, reviewComments);
      if (res.success) {
        messageApi.success("Your feedback has been saved ");
        setIsRateModalOpen(false);
        // dispatch(setDRideIdInSlice(undefined));
        clearAllStateData();
      }
    } catch (error) {
      if (error instanceof Error) messageApi.error(error.message);
      else messageApi.error("Failed to submit feedback");
    }
  };
  return (
    <DRideContext.Provider
      value={{
        // rideReqInfo,
        // isRideStarted,
        // ridePhase,
        // driverRoute,
        dropOffCoords,
        pickupCoords,
        // remainingRoute,
        // routeCoords,
        currentLoc,
        messages,
        trackingToPickupRef,
        setCurrentLoc,
        setMessages,
        clearAllStateData,
      }}
    >
      {isDialogOpen && rideReqData && (
        <RideReqModal
          acceptRide={acceptRide}
          isDialogOpen={isDialogOpen}
          rejectRide={rejectRide}
          rideReqInfo={rideReqData}
          setIsDialogOpen={setIsDialogOpen}
        />
      )}

      {OTPModal && (
        <RideOTPModal
          OTPError={OTPError}
          handleOTPSubmit={handleOTPSubmit}
          setOTPError={setOTPError}
        />
      )}

      <WaitingModal
        open={paymentModal}
        message="Waiting for payment confirmation"
      />

      {isRateModalOpen && (
        <RatingModal
          handleChange={handleRating}
          handleComments={handleReviewComments}
          closeModal={closeReviewModal}
          error={ratingErr}
          submitReview={submitReview}
        />
      )}
      {contextHolder}
      {children}
    </DRideContext.Provider>
  );
};
