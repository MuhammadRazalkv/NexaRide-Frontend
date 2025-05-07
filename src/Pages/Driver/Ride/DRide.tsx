import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchCurrentStoredLocation,
  getStatus,
  giveFeedbackDriver,
  updateIsAvailable,
  updateRandomLoc,
  verifyRideOTP,
} from "../../../api/auth/driver";
import DNavBar from "@/components/driver/DNavBar";
import ToggleSwitch from "@/components/driver/ToggleSwitch";
import { message } from "antd";
import MapComponent from "@/components/MapComp";
import {
  disconnectSocket,
  connectSocket,
  socket,
  ServerToClientEvents,
} from "@/utils/socket";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  fetchRoute,
  getLocationFromCoords,
  getRouteDetails,
} from "@/utils/geoApify";
import TimeProgressBar from "@/components/Timer";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/edit-dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TbMessage } from "react-icons/tb";
import WaitingModal from "@/components/user/WaitingModal";
import { setRideIdInSlice } from "@/redux/slices/rideSlice";
import RatingModal from "@/components/RatingModal";
import { IMessage } from "@/interfaces/chat.interface";
import ChatModal from "@/components/ChatModal";

interface IRideReqInfo {
  user: { id: string; name: string };
  pickupCoords: [number, number];
  dropOffCoords: [number, number];
  pickupLocation: string;
  dropOffLocation: string;
  time?: number;
  distance?: number;
  fare: number;
}
type NewRideReqData = Parameters<ServerToClientEvents["new-ride-req"]>[0];

interface DriverRoute {
  formattedRoute: [number, number][];
  time: number;
  distance: number;
  reachBy: Date;
}
const DRide = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [currentLoc, setCurrentLoc] = useState<[number, number] | undefined>(
    undefined
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rideReqInfo, setRideReqInfo] = useState<IRideReqInfo | null>(null);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

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
  const [driverRoute, setDriverRoute] = useState<DriverRoute | undefined>(
    undefined
  );
  const [remainingRoute, setRemainingRoute] = useState<
    [number, number][] | undefined
  >([]);
  const [isRideStarted, setIsRideStarted] = useState(false);
  const [ridePhase, setRidePhase] = useState<
    "idle" | "toPickup" | "otpVerified" | "toDropOff"
  >("idle");

  // const [remainingDropOffRoute,setRemainingDropOffRoute] = useState<[number, number][]>([]);
  const [rejected, setRejected] = useState(false);
  const rejectedRef = useRef(false); // Track latest rejected state
  const rideReqRef = useRef<IRideReqInfo | null>(null);
  const [accepted, setAccepted] = useState(false);
  const acceptedRef = useRef(false);
  const trackingToPickupRef = useRef<NodeJS.Timeout | null>(null);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [waitPayment, setWaitPayment] = useState(false);
  //! Connect socket io
  const token = useSelector((state: RootState) => state.driverAuth.token);
  const [otpDialog, setOtpDialog] = useState(false);
  const [OTP, setOTP] = useState<string | null>(null);
  const [OTPError, setOTPError] = useState("");

  const dispatch = useDispatch();
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewComments, setReviewComments] = useState("");
  const [ratingErr, setRatingError] = useState("");
  const rideId = useSelector((state: RootState) => state.ride.rideId);
  // sync the value of rejected when it changes
  const driverId = useSelector(
    (state: RootState) => state.driverAuth.driver?._id
  );
  const [chatOn, setChatOn] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([]);

  const clearAllStateData = async () => {
    setOtpDialog(false);
    setRideReqInfo(null);
    setDriverRoute(undefined);
    setPickupCoords(null);
    setDropOffCoords(null);
    setIsRideStarted(false);
    setRouteCoords(undefined);
    setRemainingRoute(undefined);
  };
  useEffect(() => {
    rejectedRef.current = rejected;
  }, [rejected]);

  useEffect(() => {
    acceptedRef.current = accepted;
  }, [accepted]);

  //  for handling new req and socket connection
  useEffect(() => {
    if (!token) {
      messageApi.error("Token missing. Please ensure you are logged in.");
      return;
    }

    if (!socket.connected) {
      connectSocket(token, "driver");
    }

    // Handling new ride requests
    const handleNewRideReq = async (data: NewRideReqData) => {
      try {
        console.log("ride request ");

        setRejected(false);
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
        rideReqRef.current = updatedRideReqInfo;
        setIsDialogOpen(true);

        const timeout = setTimeout(() => {
          if (
            rideReqRef.current?.user &&
            !rejectedRef.current &&
            !acceptedRef.current
          ) {
            socket.emit("no-response", rideReqRef.current?.user.id);
            console.log("This timeout in handle new req is working");

            setRideReqInfo(null);
            setIsDialogOpen(false);
          }
        }, 15000);

        return () => clearTimeout(timeout);
      } catch (error) {
        console.error("Error fetching ride details:", error);
        messageApi.error("Failed to fetch ride details.");
      }
    };

    const handleRideCancelled = async () => {
      console.log("Ride got cancelled");
      messageApi.error("The ride was cancelled by the User");
      socket.off("driver-location-update");
      setChatOn(false);

      clearAllStateData();
      dispatch(setRideIdInSlice(""));
      if (trackingToPickupRef.current) {
        clearInterval(trackingToPickupRef.current);
        trackingToPickupRef.current = null;
      }
    };

    const handlePaymentReceived = async () => {
      messageApi.success("Payment received successfully");
      clearAllStateData();
      setIsRateModalOpen(true);
      setWaitPayment(false);
    };
    const handleChat = (data: IMessage) => {
      setMessages((pre) => [...pre, data]);
    };
    socket.on("new-ride-req", handleNewRideReq);
    socket.on("ride-cancelled", handleRideCancelled);
    socket.on("payment-received", handlePaymentReceived);
    socket.on("chat-msg", handleChat);
    return () => {
      socket.off("new-ride-req");
      socket.off("ride-cancelled");
      socket.off("payment-received");
      socket.off("chat-msg");
      setIsDialogOpen(false);
      disconnectSocket();
    };
  }, [token, messageApi, dispatch]);

  // To Fetch driver info and redirect
  useEffect(() => {
    let isMounted = true;

    const fetchStatus = async () => {
      try {
        const res = await getStatus();
        if (!isMounted) return;

        const { driverStatus, vehicleStatus, available } = res;

        // Correctly set availability state based on fetched data
        const availability = available !== "offline";
        setIsAvailable(availability); // Directly assign true/false

        if (driverStatus === "pending" || vehicleStatus === "pending")
          navigate("/driver/verification-pending");
        else if (driverStatus === "rejected") navigate("/driver/rejected");
        else if (vehicleStatus === "rejected")
          navigate("/driver/vehicle-rejected");
      } catch (error: unknown) {
        console.log("error from getStatus", error);
        localStorage.clear();
        navigate("/driver/login");
      }
    };

    fetchStatus();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  // To Change availability
  const handleAvailabilityChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newAvailability = e.target.checked;
    setIsAvailable(newAvailability);

    try {
      const res = await updateIsAvailable();

      if (!res.success) {
        setIsAvailable(!newAvailability);
        messageApi.error("Failed to change availability");
      }
    } catch (error) {
      setIsAvailable(!newAvailability); // Revert on error
      messageApi.error("Failed to change availability");
      console.error(error);
    }
  };

  const simulatedLiveTrackingToPickUp = useCallback(
    (driverRoute: DriverRoute) => {
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
          clearInterval(interval);
          messageApi.success("Driver has reached the pickup location.");
          setRemainingRoute(undefined)
          // setDriverRoute(undefined)
          socket.emit("driver-reached");
          setOtpDialog(true);
          socket.off("driver-location-update");
        }
      }, 1000);
      trackingToPickupRef.current = interval;
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

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toString().trim();
    setOTPError("");
    if (!value) {
      return;
    } else if (value.length < 4 || value.length > 4) {
      setOTPError("Invalid OTP. Please enter a 4-digit code.");
    } else {
      setOTPError("");
      setOTP(value);
    }
  };

  const handleOTPSubmit = async () => {
    if (OTPError || !OTP) {
      return;
    }
    try {
      const response = await verifyRideOTP(OTP);
      if (response.success && response.rideId) {
        console.log("Otp verification complete");
        setOTPError("");
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

  useEffect(() => {
    if (driverRoute && !isRideStarted) {
      setRemainingRoute(driverRoute.formattedRoute);
    } else if (driverRoute && isRideStarted) {
      setRemainingRoute(driverRoute.formattedRoute);
      simulatedLiveTrackingToPickUp(driverRoute);
    }
  }, [driverRoute, isRideStarted, simulatedLiveTrackingToPickUp]);

  // To update to a new Random location
  const handleLocationUpdate = async () => {
    try {
      const res = await updateRandomLoc();
      if (res.success && res.coordinates) {
        messageApi.success("Updated a random location");
        console.log("current loc ", res.coordinates);
        setCurrentLoc([res.coordinates[1], res.coordinates[0]]);
      } else {
        messageApi.error("Failed to update a location");
      }
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        messageApi.error(error.message);
      } else {
        messageApi.error("Failed to update a location");
      }
    }
  };

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
    setAccepted(true);

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
      setRejected(true);
      setRideReqInfo(null);
      socket.emit("reject-ride", userId);
    } catch (error) {
      console.log(error);
      messageApi.error("Failed to reject ride ");
    }
  };

  // Cancel Ride
  const cancelTheRide = () => {
    socket.emit("cancel-ride", "driver");
    setChatOn(false);

    setPickupCoords(null);
    setDropOffCoords(null);
    setRouteCoords(undefined);
    setRideReqInfo(null);
    setDriverRoute(undefined);
    setIsRideStarted(false);
    setRemainingRoute(undefined);
    socket.off("driver-location-update");
    if (trackingToPickupRef.current) {
      clearInterval(trackingToPickupRef.current);
      trackingToPickupRef.current = null;
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

  const closeChat = () => {
    setChatOn(false);
  };

  const sendChatMsg = (text: string) => {
    if (!driverId) {
      return;
    }
    const newMessage: IMessage = {
      id: Date.now().toString(),
      text,
      senderId: driverId,
    };

    setMessages((prev) => [...prev, newMessage]);
    socket.emit("chat-msg", { text: text, sendBy: "driver" });
  };

  return (
    <>
      <DNavBar />
      {contextHolder}

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

      <ChatModal
        messages={messages}
        currentUserId={driverId}
        isOpen={chatOn}
        changeOpen={closeChat}
        submit={sendChatMsg}
      />
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {rideReqInfo && (
          <AlertDialogContent className="bg-white">
            <TimeProgressBar duration={15} />
            <AlertDialogHeader>
              <AlertDialogTitle className="text-black">
                New ride request from {rideReqInfo.user.name}
              </AlertDialogTitle>
              <AlertDialogDescription></AlertDialogDescription>
              <div className="text-gray-700 space-y-1">
                <div>
                  <span className="font-bold">From:</span>{" "}
                  {rideReqInfo.pickupLocation}
                </div>
                <div>
                  <span className="font-bold">To:</span>{" "}
                  {rideReqInfo.dropOffLocation}
                </div>
                <div>
                  <span className="font-bold">Est Distance:</span>{" "}
                  {rideReqInfo.distance
                    ? (rideReqInfo.distance / 1000).toFixed(2) + " km"
                    : "N/A"}
                </div>
                <div>
                  <span className="font-bold">Est Time:</span>{" "}
                  {rideReqInfo.time
                    ? Math.ceil(rideReqInfo.time / 60) + " min"
                    : "N/A"}
                </div>
                <div>
                  <span className="font-bold">Est Fare:</span> ₹
                  {rideReqInfo.fare}
                </div>
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                className="bg-red-500 hover:bg-red-700 hover:text-white text-white"
                onClick={() => rejectRide(rideReqInfo.user.id)}
              >
                Reject
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-green-500 hover:bg-green-700"
                onClick={() =>
                  acceptRide(
                    rideReqInfo.user.id,
                    rideReqInfo.pickupLocation,
                    rideReqInfo.dropOffLocation,
                    rideReqInfo.distance || 0,
                    rideReqInfo.time || 0,
                    rideReqInfo.fare,
                    rideReqInfo.pickupCoords,
                    rideReqInfo.dropOffCoords
                  )
                }
              >
                Accept
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        )}
      </AlertDialog>

      <Dialog open={otpDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm OTP</DialogTitle>
            <DialogDescription>
              Confirm the otp from the user to start the ride.
            </DialogDescription>
          </DialogHeader>
          {OTPError && <p className="text-red-500 text-xs">{OTPError}</p>}

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                OTP
              </Label>
              <Input
                id="username"
                type="number"
                className="col-span-3"
                onChange={handleOTPChange}
              />
            </div>
          </div>
          <DialogFooter>
            {/* <Button
              onClick={() => {
                if (isDialogOpen) {
                  setIsDialogOpen(false);
                }
                setNameErr(null);
                setPhoneErr("");
              }}
              variant={"outline"}
            >
              Cancel{" "}
            </Button> */}
            <Button onClick={handleOTPSubmit}>Verify OTP</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
        {rideReqInfo && (
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Ride Confirmation</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel this ride? This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Ride</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 text-white hover:bg-red-600 transition"
                onClick={cancelTheRide}
              >
                Yes, Cancel Ride
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        )}
      </AlertDialog>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] mt-6 mx-5 gap-5 md:min-h-[calc(80vh-90px)] lg:min-h-[calc(100vh-90px)] overflow-x-auto">
        {/* Left Section - Info Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 flex max-h-min flex-col gap-4">
          {!rideReqInfo && (
            <div className="bg-white mt-4 p-4 rounded-xl shadow-md ">
              <>
                <button
                  onClick={handleLocationUpdate}
                  className="bg-black text-white px-4 py-2 rounded-lg transition-transform duration-200 hover:scale-105 hover:bg-gray-800"
                >
                  Assign Location
                </button>
                <div className="flex items-center gap-3">
                  <p className="text-gray-700 font-medium">
                    Ready to take rides
                  </p>
                  <ToggleSwitch

                    isChecked={isAvailable}
                    onChange={handleAvailabilityChange}
                  />
                </div>
              </>
            </div>
          )}
          <h2 className="text-xl font-bold text-gray-800">Ride Info</h2>
          <p className="text-gray-600">
            Details about your current status and rides.
          </p>

          {rideReqInfo && driverRoute && (
            <div className="mt-4 border-t border-gray-200 pt-4 space-y-3">
              {ridePhase === "toPickup" && (
                <>
                  <p className="text-sm text-gray-500 mt-2">
                    <span className="font-medium text-black">Reach by:</span>{" "}
                    {driverRoute.reachBy.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-black">
                      Distance to Pickup:
                    </span>{" "}
                    {(driverRoute.distance / 1000).toFixed(2)} km
                  </p>

                  <div className="flex flex-col sm:flex-row mt-6 gap-3">
                    <button
                      className="bg-black text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-800 transition duration-200 w-full sm:w-auto flex items-center justify-center space-x-2"
                      onClick={() => setChatOn(true)}
                    >
                      <TbMessage className="text-white text-base" />
                      <span>Message User</span>
                    </button>

                    <button
                      className="bg-red-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200 w-full sm:w-auto"
                      onClick={() => setIsCancelOpen(true)}
                    >
                      Cancel Ride
                    </button>
                  </div>
                </>
              )}

              {ridePhase === "toDropOff" && (
                <>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-black">From:</span>{" "}
                    {rideReqInfo.pickupLocation}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-black">To:</span>{" "}
                    {rideReqInfo.dropOffLocation}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-black">Distance:</span>{" "}
                    {rideReqInfo.distance
                      ? (rideReqInfo.distance / 1000).toFixed(2)
                      : "N/A"}{" "}
                    km
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-black">Fare:</span> ₹
                    {rideReqInfo.fare}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-black">
                      Estimated Drop-off:
                    </span>{" "}
                    {rideReqInfo.time
                      ? new Date(
                          Date.now() + rideReqInfo.time * 1000
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "NA"}
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        <div className="w-full min-h-[400px] max-h-[80vh] z-0">
          <MapComponent
            pickupCoords={pickupCoords}
            dropOffCoords={dropOffCoords}
            routeCoords={routeCoords}
            driverLoc={currentLoc}
            isRideStarted={isRideStarted}
            driverRoute={
              isRideStarted ? remainingRoute : driverRoute?.formattedRoute
            }
          />
        </div>
      </div>
    </>
  );
};

export default DRide;
