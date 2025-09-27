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
import { useDriverTrackingService } from "@/hooks/useDriverTracking";
import { IMessage } from "@/interfaces/chat.interface";
import { IRideReqInfo } from "@/pages/driver/ride/DRide";
import {
  openOTPModal,
  // openPaymentModal,
  resetDriverRideInSlice,
  setDCurrentLocInSlice,
  setDDriverRouteInSlice,
  setDDropOffCoordsInSlice,
  setDIsRideStartedInSlice,
  setDPickupCoordsInSlice,
  // setDRemainingRouteInSlice,
  setDRideIdInSlice,
  setDRidePhaseInSlice,
  setDRideReqInfoInSlice,
  setDRouteCoordsInSlice,
} from "@/redux/slices/driverRideSlice";
import { RootState } from "@/redux/store";
import { DriverTrackingService } from "@/services/DriverTrackingService";
// import { DriverTrackingService } from "@/services/DriverTrackingService";
import { fetchRoute } from "@/utils/geoApify";
import { socket } from "@/utils/socket";
import { message } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export interface DSocketContextTypes {
  pickupCoords: [number, number] | null;
  dropOffCoords: [number, number] | null;
  currentLoc?: [number, number];
  messages: IMessage[];
  setCurrentLoc: React.Dispatch<
    React.SetStateAction<[number, number] | undefined>
  >;
  setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
  clearAllStateData: () => void;
  // trackingToPickupRef: React.MutableRefObject<NodeJS.Timeout | null>;
  trackingService:DriverTrackingService
  setChatOn:React.Dispatch<React.SetStateAction<boolean>>
  chatOn:boolean
}

export const DRideProvider = ({ children }: { children: React.ReactNode }) => {
  const token = useSelector((state: RootState) => state.driverAuth.token);
  const [rideReqData, setRideReqData] = useState<IRideReqInfo>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [pickupCoords, setPickupCoords] = useState<[number, number] | null>(
    null
  );
  const [dropOffCoords, setDropOffCoords] = useState<[number, number] | null>(
    null
  );

  //* Drivers current location
  const [currentLoc, setCurrentLoc] = useState<[number, number]>();

  const [OTPError, setOTPError] = useState("");

  const [messageApi, contextHolder] = message.useMessage();
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewComments, setReviewComments] = useState("");
  const [ratingErr, setRatingError] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [rideRejected, setRideRejected] = useState(false);
  const [chatOn, setChatOn] = useState(false);

  // const trackingToPickupRef = useRef<NodeJS.Timeout | null>(null);
  const [firstRender, setFirstRender] = useState(true);
  const dispatch = useDispatch();

  // creating a instance of Driver tracking service
  const trackingService = useDriverTrackingService(
    socket,
    dispatch,
    messageApi
  );

  const {
    isRideStarted,
    routeCoords,
    OTPModal,
    paymentModal,
    rideId,
    ridePhase,
    driverRoute,
    // remainingRoute,
    dDropOffIndex,
    dPickupIndex,
  } = useSelector((state: RootState) => state.DRide);

  const clearAllStateData = () => {
    setIsDialogOpen(false);
    setPickupCoords(null);
    setDropOffCoords(null);
    setCurrentLoc(undefined);
    setIsRateModalOpen(false);
    setRating(0);
    setReviewComments("");
    setRatingError("");
    setMessages([]);
    setRideRejected(false);
    dispatch(resetDriverRideInSlice());
  };

  //! update this to use the new Tracking service instance
  useDriverSocketEvents({
    token,
    setRideReqData,
    setIsDialogOpen,
    setIsRateModalOpen,
    setMessages,
    dispatch,
    rideRejected,
    isRideStarted,
    messageApi,
    clearAllStateData,
    // trackingToPickupRef,
    trackingService,
  });

  useEffect(() => {
    if (!firstRender) return;

    if (isRideStarted) {
      if (ridePhase == "toPickup" && driverRoute) {
        trackingService.start(
          driverRoute?.formattedRoute,
          dPickupIndex,
          "toPickup",
          setCurrentLoc
        );
      } else if (ridePhase == "toDropOff" && routeCoords?.length) {
        trackingService.start(routeCoords, dDropOffIndex, "toDropOff",setCurrentLoc);
      }
    }
    setFirstRender(false);
  }, [
    isRideStarted,
    driverRoute,
    routeCoords,
    // remainingRoute,
    ridePhase,
    firstRender,
    dispatch,
    dDropOffIndex,
    dPickupIndex,
    trackingService,
    // simulatedLiveTrackingToPickUp,
    // simulatedLiveTrackingToDropOff,
  ]);

  useEffect(()=>{
    console.log('Current location changed',currentLoc);
    
  },[currentLoc])

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

    //! I think this is not needed in the code .
    setCurrentLoc(location.coordinates);
    dispatch(setDCurrentLocInSlice(location.coordinates));

    // Fetch route from driver location to pickup
    const driverRouteInfo = await fetchRoute(location.location, pickupCoords);
    if (!driverRouteInfo) {
      message.error("Failed to calculate driver route");
      return;
    }

    const reachBy = new Date(Date.now() + driverRouteInfo.time * 1000);
    const fullDriverRoute = { ...driverRouteInfo, reachBy };

    dispatch(setDDriverRouteInSlice(fullDriverRoute));
    // dispatch(setDRemainingRouteInSlice(fullDriverRoute.formattedRoute));

    // Fetch route from pickup to drop-off
    const routeCoordsRes = await fetchRoute(
      [pickupCoords[1], pickupCoords[0]],
      dropOffCoords
    );

    if (routeCoordsRes && routeCoordsRes.formattedRoute) {
      dispatch(setDRouteCoordsInSlice(routeCoordsRes.formattedRoute));
    } else {
      messageApi.error("Failed to calculate drop-off route");
    }

    dispatch(setDIsRideStartedInSlice(true));
    // simulatedLiveTrackingToPickUp(fullDriverRoute);
    trackingService.start(
      fullDriverRoute?.formattedRoute,
      dPickupIndex,
      "toPickup",
      setCurrentLoc
    );
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
          trackingService.start(routeCoords, dDropOffIndex, "toDropOff",setCurrentLoc);
        }
        // else {
        //   const routeCoordsRes = await fetchRoute(
        //     [pickupCoords[1], pickupCoords[0]],
        //     dropOffCoords
        //   );

        //   if (routeCoordsRes && routeCoordsRes.formattedRoute) {
        //     dispatch(setDRouteCoordsInSlice(routeCoordsRes.formattedRoute));
        //   } else {
        //     messageApi.error("Failed to calculate drop-off route");
        //   }
        // }
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
        dropOffCoords,
        pickupCoords,
        currentLoc,
        messages,
        // trackingToPickupRef,
        trackingService,
        setCurrentLoc,
        setMessages,
        clearAllStateData,
        chatOn,
        setChatOn
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
          setChatOn={setChatOn}
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
