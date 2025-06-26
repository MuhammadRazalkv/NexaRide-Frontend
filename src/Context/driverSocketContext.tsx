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
import { setRideIdInSlice } from "@/redux/slices/rideSlice";
import { RootState } from "@/redux/store";
import {
  fetchRoute,
  // getLocationFromCoords,
  // getRouteDetails,
} from "@/utils/geoApify";
import { socket } from "@/utils/socket";
import { message } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export interface DSocketContextTypes {
  rideReqInfo?: IRideReqInfo;
  pickupCoords: [number, number] | null;
  dropOffCoords: [number, number] | null;
  routeCoords?: [number, number][];
  driverRoute?: IDriverRoute;
  remainingRoute?: [number, number][];
  isRideStarted: boolean;
  ridePhase: "idle" | "toPickup" | "otpVerified" | "toDropOff";
  currentLoc?: [number, number];
  messages: IMessage[];
  setCurrentLoc: React.Dispatch<
    React.SetStateAction<[number, number] | undefined>
  >;
  setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
}
// type NewRideReqData = Parameters<ServerToClientEvents["new-ride-req"]>[0];

export const DRideProvider = ({ children }: { children: React.ReactNode }) => {
  const token = useSelector((state: RootState) => state.driverAuth.token);
  const [rideReqInfo, setRideReqInfo] = useState<IRideReqInfo>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRideStarted, setIsRideStarted] = useState(false);
  const [ridePhase, setRidePhase] = useState<
    "idle" | "toPickup" | "otpVerified" | "toDropOff"
  >("idle");
  const [pickupCoords, setPickupCoords] = useState<[number, number] | null>(
    null
  );
  const [dropOffCoords, setDropOffCoords] = useState<[number, number] | null>(
    null
  );
  const [routeCoords, setRouteCoords] = useState<
    [number, number][] | undefined
  >([]);
  // const [driverArrived, setDriverArrived] = useState(false);
  const [driverRoute, setDriverRoute] = useState<IDriverRoute | undefined>(
    undefined
  );
  const [remainingRoute, setRemainingRoute] = useState<
    [number, number][] | undefined
  >([]);

  const [currentLoc, setCurrentLoc] = useState<[number, number] | undefined>(
    undefined
  );
  const [otpDialog, setOtpDialog] = useState(false);
  const [OTPError, setOTPError] = useState("");

  const [messageApi, contextHolder] = message.useMessage();
  const [waitPayment, setWaitPayment] = useState(false);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewComments, setReviewComments] = useState("");
  const [ratingErr, setRatingError] = useState("");
  const rideId = useSelector((state: RootState) => state.ride.rideId);
  const [messages, setMessages] = useState<IMessage[]>([]);

  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (!token) {
  //     return;
  //   }
  //   connectSocket(token, "driver");

  //   const handleNewRideReq = async (data: NewRideReqData) => {
  //     try {
  //       console.log("ride request ");

  //       // setRejected(false);
  //       const [pickupLocation, dropOffLocation, timeAndDistance] =
  //         await Promise.all([
  //           getLocationFromCoords(data.pickupCoords),
  //           getLocationFromCoords(data.dropOffCoords),
  //           getRouteDetails(data.pickupCoords, data.dropOffCoords),
  //         ]);

  //       const updatedRideReqInfo = {
  //         ...data,
  //         pickupLocation:
  //           pickupLocation.address_line1 + pickupLocation.address_line2,
  //         dropOffLocation:
  //           dropOffLocation.address_line1 + dropOffLocation.address_line2,
  //         ...timeAndDistance,
  //       };

  //       setRideReqInfo(updatedRideReqInfo);
  //       // rideReqRef.current = updatedRideReqInfo;
  //       setIsDialogOpen(true);

  //       // const timeout = setTimeout(() => {
  //       //   if (
  //       //     rideReqRef.current?.user &&
  //       //     !rejectedRef.current &&
  //       //     !acceptedRef.current
  //       //   ) {
  //       //     socket.emit("no-response", rideReqRef.current?.user.id);
  //       //     console.log("This timeout in handle new req is working");

  //       //     setRideReqInfo(null);
  //       //     setIsDialogOpen(false);
  //       //   }
  //       // }, 15000);

  //       // return () => clearTimeout(timeout);
  //     } catch (error) {
  //       console.error("Error fetching ride details:", error);
  //       messageApi.error("Failed to fetch ride details.");
  //     }
  //   };

  //   const handlePaymentReceived = async () => {
  //     messageApi.success("Payment received successfully");
  //     // clearAllStateData();
  //     setIsRateModalOpen(true);
  //     setWaitPayment(false);
  //   };
  //   const handleChat = (data: IMessage) => {
  //     messageApi.info("You have a new message ");

  //     setMessages((pre) => [...pre, data]);
  //   };

  //   const handleRideCancelled = async () => {
  //     console.log("Ride got cancelled");
  //     messageApi.error("The ride was cancelled by the User");
  //     socket.off("driver-location-update");
  //     // setChatOn(false);

  //     // clearAllStateData();
  //     dispatch(setRideIdInSlice(""));

  //     // if (trackingToPickupRef.current) {
  //     //   clearInterval(trackingToPickupRef.current);
  //     //   trackingToPickupRef.current = null;
  //     // }
  //   };
  //   socket.on("ride-cancelled", handleRideCancelled);

  //   socket.on("new-ride-req", handleNewRideReq);
  //   socket.on("payment-received", handlePaymentReceived);
  //   socket.on("chat-msg", handleChat);
  //   return () => {
  //     socket.off("new-ride-req");
  //     socket.off("ride-cancelled");
  //     socket.off("payment-received");
  //     socket.off("chat-msg");
  //   };
  // }, [token, messageApi, dispatch]);

  useDriverSocketEvents({
    token,
    setRideReqInfo,
    setIsDialogOpen,
    setIsRateModalOpen,
    setWaitPayment,
    setMessages,
    dispatch,
    messageApi,
  });

  const simulatedLiveTrackingToPickUp = useCallback(
    (driverRoute: IDriverRoute) => {
      let currentIndex = 0;
      setCurrentLoc(undefined);

      const interval = setInterval(() => {
        if (currentIndex < driverRoute.formattedRoute.length) {
          const currentLocation = driverRoute.formattedRoute[currentIndex];

          socket.emit("driver-location-update", {
            type: "toPickup",
            location: currentLocation,
          });

          // Update the remaining route only after ride starts

          setRemainingRoute((prevRoute) => {
            if (prevRoute) {
              return prevRoute.slice(1);
            }
          });

          currentIndex++;
        } else {
          console.log('Inside the else of the pickup');
          
          clearInterval(interval);
          messageApi.success("Driver has reached the pickup location.");
          setRemainingRoute(undefined);
          socket.emit("driver-reached");
          setOtpDialog(true);
          console.log('otp dialoge opend');
          
          socket.off("driver-location-update");
        }
      }, 1000);
      // trackingToPickupRef.current = interval;
      return () => clearInterval(interval);
    },
    [messageApi]
  );

  const simulatedLiveTrackingToDropOff = useCallback(
    (routeCoords: [number, number][]) => {
      console.log(" route coords ", routeCoords);

      let currentIndex = 0;
      setCurrentLoc(undefined);

      const interval = setInterval(() => {
        if (currentIndex < routeCoords.length) {
          const currentLocation = routeCoords[currentIndex];

          socket.emit("driver-location-update", {
            type: "toDropOff",
            location: currentLocation,
          });
          // setCurrentLoc(currentLocation);

          // Update the remaining route only after ride starts
          // setRemainingDropOffRoute((prevRoute) => prevRoute.slice(1));
          setRouteCoords((prevRoute) => {
            if (prevRoute) {
              return prevRoute.slice(1);
            }
          });
          currentIndex++;
        } else {
          clearInterval(interval);
          messageApi.success("Driver has reached the drop off location.");
          socket.emit("dropOff-reached");
          socket.off("driver-location-update");
          setWaitPayment(true);
        }
      }, 1000);

      return () => clearInterval(interval);
    },
    [messageApi]
  );

  useEffect(() => {
    if (driverRoute && !isRideStarted) {
      setRemainingRoute(driverRoute.formattedRoute);
    } else if (driverRoute && isRideStarted) {
      setRemainingRoute(driverRoute.formattedRoute);
      simulatedLiveTrackingToPickUp(driverRoute);
    }
  }, [driverRoute, isRideStarted, simulatedLiveTrackingToPickUp]);

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
    setRidePhase("toPickup");
    setPickupCoords(pickupCoords);
    setDropOffCoords(dropOffCoords);
    const location = await fetchCurrentStoredLocation();
    if (location.success && location.location) {
      setCurrentLoc(location.coordinates);
      const driverRouteInfo = await fetchRoute(location.location, pickupCoords);
      if (driverRouteInfo) {
        const reachBy = new Date(Date.now() + driverRouteInfo?.time * 1000);
        setDriverRoute({ ...driverRouteInfo, reachBy });
      } else {
        messageApi.error("Failed to calculate driver route");
      }
      pickupCoords = [pickupCoords[1], pickupCoords[0]];
      const routeCoords = await fetchRoute(pickupCoords, dropOffCoords);
      if (routeCoords && routeCoords.formattedRoute) {
        setRouteCoords(routeCoords.formattedRoute);
      } else {
        messageApi.error("Failed to calculate route");
      }
      setIsRideStarted(true);
    }
  };

  // Reject the ride
  const rejectRide = async (userId: string) => {
    try {
      setRideReqInfo(undefined);
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
        setOtpDialog(false);
        setRidePhase("toDropOff");
        dispatch(setRideIdInSlice(response.rideId));
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
    dispatch(setRideIdInSlice(""));
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
        dispatch(setRideIdInSlice(""));
      }
    } catch (error) {
      if (error instanceof Error) messageApi.error(error.message);
      else messageApi.error("Failed to submit feedback");
    }
  };
  return (
    <DRideContext.Provider
      value={{
        rideReqInfo,
        isRideStarted,
        ridePhase,
        driverRoute,
        dropOffCoords,
        pickupCoords,
        remainingRoute,
        routeCoords,
        currentLoc,
        messages,
        setCurrentLoc,
        setMessages,
      }}
    >
      {isDialogOpen && rideReqInfo && (
        <RideReqModal
          acceptRide={acceptRide}
          isDialogOpen={isDialogOpen}
          rejectRide={rejectRide}
          rideReqInfo={rideReqInfo}
          setIsDialogOpen={setIsDialogOpen}
        />
      )}

      {otpDialog && (
        <RideOTPModal
          OTPError={OTPError}
          handleOTPSubmit={handleOTPSubmit}
          setOTPError={setOTPError}
        />
      )}

      <WaitingModal
        open={waitPayment}
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
