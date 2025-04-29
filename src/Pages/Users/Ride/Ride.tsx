import { useState, useEffect, useRef, useCallback } from "react";
import NavBar from "@/components/user/NavBar";
import MapComponent from "@/components/MapComp";
import axios from "axios";
import { message } from "antd";
import {
  checkCabs,
  giveFeedback,
  payUsingStripe,
  payUsingWallet,
} from "@/api/auth/user";
import { Car3D } from "@/Assets";
import { socket, connectSocket, RideInfo } from "@/utils/socket";
import { RootState } from "@/redux/store";
import WaitingModal from "@/components/user/WaitingModal";
import { fetchRoute, getRouteDetails } from "@/utils/geoApify";
import { TbMessage } from "react-icons/tb";
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
import PaymentOptions from "@/components/user/PaymentOptions";
import { useDispatch, useSelector } from "react-redux";
import { setInPayment, setRideIdInSlice } from "@/redux/slices/rideSlice";
import RatingModal from "@/components/RatingModal";

import AvailableDriverList from "@/components/user/AvailableDriverList";
import ChatModal from "@/components/ChatModal";
import { IMessage } from "@/interfaces/chat.interface";
import { CheckCabs, DriverRoute, Drivers } from "@/interfaces/ride.interface";
import RideLocationsInput from "@/components/user/RideLocationsInput";
// import { useRide } from "@/context/SocketContext";

const Ride = () => {

  // const {chatOn,driverArrived,isRateModalOpen,isRideStarted,messages,paymentModalOpen,rideInfo} = useRide()




  const [pickupCoords, setPickupCoords] = useState<[number, number]>();
  const [dropOffCoords, setDropOffCoords] = useState<[number, number]>();
  const [routeCoords, setRouteCoords] = useState<
    [number, number][] | undefined
  >([]);
  const routeCoordsRef = useRef<[number, number][] | undefined>([]);
  const [distance, setDistance] = useState<number>();
  const [availableDrivers, setAvailableDrivers] = useState<
    Drivers[] | undefined
  >(undefined);
  const [time, setTime] = useState<number>();
  const [messageApi, contextHolder] = message.useMessage();
  const [markDrivers, setMarkDrivers] = useState<
    | { driverId: string; name: string; coordinates: [number, number] }[]
    | undefined
  >(undefined);
  const [noDriversFound, setNoDriversFound] = useState<boolean>(false);
  const [sendRideReq, setSendRideReq] = useState(false);
  const token = useSelector((state: RootState) => state.auth.token);
  const [rideInfo, setRideInfo] = useState<RideInfo | null>(null);
  const [driverRoute, setDriverRoute] = useState<DriverRoute | undefined>(
    undefined
  );
  const [isRideStarted, setIsRideStarted] = useState(false);
  const [driverArrived, setDriverArrived] = useState(false);
  const [driverLiveLocation, setDriverLiveLocation] =
    useState<[number, number]>();
  const [remainingRoute, setRemainingRoute] = useState<
    [number, number][] | undefined
  >([]);
  const [remainingDropOffRoute, setRemainingDropOffRoute] = useState<
    [number, number][] | undefined
  >([]);

  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const noResRef = useRef<() => void>();
  const sendRideReqRef = useRef(false);
  const toDropOff = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [rideId, setRideId] = useState<string>();
  const dispatch = useDispatch();
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewComments, setReviewComments] = useState("");
  const [ratingErr, setRatingError] = useState("");
  const rideIdFromSlice = useSelector((state: RootState) => state.ride.rideId);
   const inPayment = useSelector((state: RootState) => state.ride.inPayment);
  const userId = useSelector((state: RootState) => state.auth.user?._id);

  const [chatOn, setChatOn] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([]);

  const clearAllStateData = () => {
    // setInput("");
    // setDropOff("");
    setPickupCoords(undefined);
    setDropOffCoords(undefined);
    setRouteCoords(undefined);
    setDistance(undefined);
    setTime(undefined);
    setRideInfo(null);
    setDriverRoute(undefined);
    setIsRideStarted(false);
    setDriverArrived(false);
    setRemainingDropOffRoute(undefined);
    setRemainingRoute(undefined);
  };
  useEffect(() => {
    if (inPayment) {
      setPaymentModalOpen(true);
      setRideId(rideIdFromSlice);
    }
  }, [rideIdFromSlice, inPayment]);

  useEffect(() => {
    sendRideReqRef.current = sendRideReq;
  }, [sendRideReq]);

  useEffect(() => {
    routeCoordsRef.current = routeCoords;
  }, [routeCoords]);

  useEffect(() => {
    const fetchRoute = async () => {
      if (!pickupCoords || !dropOffCoords) {
        console.warn("Pickup or Drop-off coordinates are missing.");
        return;
      }
      setAvailableDrivers(undefined);
      setMarkDrivers(undefined);

      const api = `https://api.geoapify.com/v1/routing?waypoints=${pickupCoords[0]},${pickupCoords[1]}|${dropOffCoords[0]},${dropOffCoords[1]}&mode=drive&apiKey=5f91c9c458154879844c3d0447834abf&type=short`;

      try {
        const response = await axios.get(api);
        const coordinates = response.data.features[0].geometry.coordinates;
        const distance = response.data.features[0].properties.distance;
        const time = response.data.features[0].properties.time;
        setTime(time);
        setDistance(distance);

        const formattedRoute = coordinates[0].map((coord: [number, number]) => [
          coord[1],
          coord[0],
        ]);

        setRouteCoords(formattedRoute);
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    };

    if (pickupCoords && dropOffCoords) {
      fetchRoute();
    }
  }, [pickupCoords, dropOffCoords]);

  // Handle no response form driver
  const handleNoDriverResponse = useCallback(() => {
    messageApi.info("Driver did not respond. Please try again.");
    sendRideReqRef.current = false;
    setSendRideReq(false);
  }, [messageApi]);

  //! Listen to driver ride response
  useEffect(() => {
    if (!token) {
      messageApi.error("Token missing. Please ensure you are logged in.");

      return;
    }
    connectSocket(token, "user");

    const stopSendingRequest = () => setSendRideReq(false);

    //* Handle ride rejection
    const handleRideRejected = (driverId: string) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      sendRideReqRef.current = false;
      setAvailableDrivers((prevDrivers) =>
        prevDrivers
          ? prevDrivers.filter((driver) => driver._id !== driverId)
          : []
      );

      messageApi.info("Your ride request has been rejected by the driver.");
      stopSendingRequest();
    };

    noResRef.current = handleNoDriverResponse;

    //* Handle driver ride acceptance
    const handleRideAccepted = async (data: RideInfo) => {
      try {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        sendRideReqRef.current = false;
        stopSendingRequest();
        setAvailableDrivers(undefined);
        setMarkDrivers(undefined);
        setRideInfo(data);
        setIsRideStarted(true);
        const routeDetails = await fetchRoute(
          data.driver.location.coordinates,
          data.pickupCoords
        );

        if (!routeDetails) {
          throw new Error("Failed to calculate driver route");
        }
        setDriverLiveLocation(data.driver.location.coordinates);
        setDriverRoute(routeDetails);
        setRemainingRoute(routeDetails.formattedRoute);
        setRemainingDropOffRoute(routeCoordsRef.current);
        messageApi.success(`${data.driver.name} accepted your ride request`);
      } catch (error: unknown) {
        if (error instanceof Error) {
          messageApi.error(error.message);
        } else {
          messageApi.error("An unexpected error occurred");
        }
      }
    };

    const handleDriverLocationUpdate = async (data: {
      type: "toPickup" | "toDropOff";
      location: [number, number];
    }) => {
      if (data.type == "toPickup") {
        const location = data.location;
        setDriverLiveLocation(undefined);

        setRemainingRoute((prevRoute) => {
          if (!prevRoute || prevRoute.length === 0) return [];
          const isSameLocation = (a: [number, number], b: [number, number]) => {
            const TOLERANCE = 0.0001;
            return (
              Math.abs(a[0] - b[0]) < TOLERANCE &&
              Math.abs(a[1] - b[1]) < TOLERANCE
            );
          };

          if (isSameLocation(prevRoute[0], location)) {
            return prevRoute.slice(1);
          }

          return prevRoute;
        });
      } else if (data.type == "toDropOff") {
        toDropOff.current = true;
        setRemainingDropOffRoute((prevRoute) => {
          if (!prevRoute || prevRoute.length === 0) return [];
          const isSameLocation = (a: [number, number], b: [number, number]) => {
            const TOLERANCE = 0.0001;
            return (
              Math.abs(a[0] - b[0]) < TOLERANCE &&
              Math.abs(a[1] - b[1]) < TOLERANCE
            );
          };
          if (isSameLocation(prevRoute[0], data.location)) {
            console.log("Matched, slicing the route");
            return prevRoute.slice(1);
          }
          console.log("No match, keeping the same route");
          return prevRoute;
        });
      }
    };

    const handleDriverReached = async () => {
      messageApi.success(
        "Driver reached your location please share your otp to start the ride"
      );
      setDriverLiveLocation(undefined);
      setRemainingRoute(undefined);
      setDriverArrived(true);

      // socket.off("driver-location-update", handleDriverLocationUpdate);
    };

    const handleRideCancelled = async () => {
      messageApi.error("The ride was cancelled by the driver");
      clearAllStateData();
      socket.off("driver-location-update");
    };
    const handleDropOffReached = async (data: {
      rideId: string;
      fare: number;
    }) => {
      setPaymentModalOpen(true);
      setRideId(data.rideId);
      dispatch(setRideIdInSlice(data.rideId));
      dispatch(setInPayment(true));
    };

    const handlePaymentSuccess = async () => {
      setIsRateModalOpen(true);
      messageApi.success("Payment success");
      // dispatch(setRideIdInSlice(""));
      dispatch(setInPayment(false));
      setPaymentModalOpen(false);
      setIsRateModalOpen(true);
      // setRideId(undefined);
      setChatOn(false);
      clearAllStateData();
    };

    const handleChat = (data: IMessage) => {
      setMessages((pre) => [...pre, data]);
    };

    socket.on("ride-rejected", handleRideRejected);
    socket.on("no-driver-response", handleNoDriverResponse);
    socket.on("ride-accepted", handleRideAccepted);
    socket.on("driver-location-update", handleDriverLocationUpdate);
    socket.on("driver-reached", handleDriverReached);
    socket.on("ride-cancelled", handleRideCancelled);
    socket.on("dropOff-reached", handleDropOffReached);
    socket.on("payment-success", handlePaymentSuccess);
    socket.on("chat-msg", handleChat);
    return () => {
      socket.off("ride-rejected", handleRideRejected);
      socket.off("no-driver-response", handleNoDriverResponse);
      socket.off("ride-accepted", handleRideAccepted);
      socket.off("driver-location-update", handleDriverLocationUpdate);
      socket.off("driver-reached", handleDriverReached);
      socket.off("ride-cancelled", handleRideCancelled);
      socket.off("payment-success");
      socket.off("chat-msg", handleChat);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      console.log("Comp unmounting");
    };
  }, [messageApi, handleNoDriverResponse, dispatch, token]);

  const handleSuggestionClick = (
    coordinates: [number, number],
    type: string
  ) => {
    if (!coordinates) {
      return;
    }

    if (type === "Pickup") {
      setPickupCoords([coordinates[1], coordinates[0]]);
    } else {
      setDropOffCoords([coordinates[1], coordinates[0]]);
    }
  };

  const handleCheckCabs = async () => {
    try {
      if (!pickupCoords || !dropOffCoords) {
        messageApi.warning("Please choose the locations");
        return;
      }
      if (!distance || !time) {
        messageApi.warning(
          "Please wait until calculating the time and distance"
        );
        return;
      }

      const data: CheckCabs = {
        pickUpPoint: { lng: pickupCoords[0], lat: pickupCoords[1] },
        dropOffPoint: { lng: dropOffCoords[0], lat: dropOffCoords[1] },
        distance: distance,
        time: time,
      };

      const res = await checkCabs(data);

      if (res.success && res.drivers && res.drivers.length > 0) {
        setNoDriversFound(false);
        const updatedDrivers = await Promise.all(
          res.drivers.map(async (driver: Drivers) => {
            const result = await fetchTimeAndDistance(
              driver.location.coordinates,
              pickupCoords
            );

            return {
              ...driver,
              distanceInKm: result?.distanceInKm || "N/A",
              timeInMinutes: result?.timeInMinutes || "N/A",
            };
          })
        );

        setAvailableDrivers(updatedDrivers);
        if (res.drivers) {
          const convertedDrivers = res.drivers.map((driver: Drivers) => ({
            driverId: driver._id,
            name: driver.name,
            coordinates: [
              driver.location.coordinates[1],
              driver.location.coordinates[0],
            ],
          }));

          setMarkDrivers(convertedDrivers);
        }
      } else {
        setAvailableDrivers(undefined);
        setNoDriversFound(true);
      }
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof Error) {
        messageApi.error(`Failed to fetch cabs ${error.message}`);
      } else {
        messageApi.error(`Failed to fetch cabs`);
      }
    }
  };

  const fetchTimeAndDistance = async (
    driverCoords: [number, number],
    pickupCoords: [number, number]
  ): Promise<
    { distanceInKm: string; timeInMinutes: number | string } | undefined
  > => {
    try {
      const response = await getRouteDetails(
        [driverCoords[1], driverCoords[0]],
        pickupCoords
      );

      if (response) {
        const distanceInKm = (response.distance / 1000).toFixed(1);
        const timeInMinutes = Math.round(response.time / 60);
        return { distanceInKm, timeInMinutes };
      }
      return { distanceInKm: "N/A", timeInMinutes: "N/A" };
    } catch (error) {
      console.error("Error fetching route:", error);
      return undefined;
    }
  };

  const bookTheCab = (driverId: string, fare: number) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    sendRideReqRef.current = false;
    if (!driverId) {
      messageApi.error("Driver not found");
      return;
    }

    if (!token) {
      messageApi.error("Token not found .Please ensure you are logged in ");
      return;
    }
    if (!pickupCoords || !dropOffCoords || !time || !distance) {
      messageApi.error("Please ensure the the locations are provided");
      return;
    }

    setMarkDrivers((prevDrivers) =>
      prevDrivers
        ? prevDrivers.filter((driver) => driver.driverId !== driverId)
        : []
    );
    socket.emit("request-ride", {
      driverId,
      pickupCoords,
      dropOffCoords,
      time,
      distance,
      fare,
    });
    setSendRideReq(true);

    timerRef.current = setTimeout(() => {
      if (sendRideReqRef.current) {
        handleNoDriverResponse();
      }
    }, 35000);
  };

  const cancelTheRide = () => {
    socket.emit("cancel-ride", "user");
    clearAllStateData();
    setChatOn(false);
    socket.off("driver-location-update");
  };

  const handlePaymentSelection = async (method: "wallet" | "stripe") => {
    if (method === "wallet") {
      try {
        if (!rideId) {
          console.log("Ride id not found ");
          return;
        }
        const response = await payUsingWallet(rideId);
        if (response.success) {
          messageApi.success("Payment successful");
          setPaymentModalOpen(false);
          setIsRateModalOpen(true);
          clearAllStateData();
          // dispatch(setRideIdInSlice(""));
          dispatch(setInPayment(false));
          // setRideId(undefined);
        }
      } catch (error) {
        console.log(error);
        if (error instanceof Error) {
          messageApi.error(error.message);
        } else {
          messageApi.error("Failed to pay using wallet");
        }
      }
    } else if (method === "stripe") {
      try {
        if (!rideId) {
          console.log("Ride id not found ");
          return;
        }
        const res = await payUsingStripe(rideId);
        if (res.success && res.url) {
          // window.location.href = res.url;
          window.open(res.url, "_blank");
        }
      } catch (error) {
        console.log(error);
        if (error instanceof Error) {
          messageApi.error(error.message);
        } else {
          messageApi.error("Failed to pay using wallet");
        }
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
    dispatch(setRideIdInSlice(""));
    setIsRateModalOpen(false);
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
    if (/[^a-zA-Z0-9\s]/g.test(reviewComments)) {
      setRatingError("No special characters allowed");
      return;
    }
    if (!rideId) {
      messageApi.error("Ride id not found");
      return;
    }

    try {
      const res = await giveFeedback(rideId, rating, reviewComments);
      if (res.success) {
        messageApi.success("Your feedback has been saved ");
        setIsRateModalOpen(false);
        dispatch(setRideIdInSlice(""));
        setRideId(undefined);
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
    if (!userId) {
      return;
    }
    const newMessage: IMessage = {
      id: Date.now().toString(),
      text,
      senderId: userId,
    };

    setMessages((prev) => [...prev, newMessage]);
    socket.emit("chat-msg", { text: text, sendBy: "user" });
  };

  return (
    <>
      <NavBar />
      {contextHolder}
      {isRateModalOpen && (
        <RatingModal
          handleChange={handleRating}
          handleComments={handleReviewComments}
          closeModal={closeReviewModal}
          error={ratingErr}
          submitReview={submitReview}
        />
      )}
      <WaitingModal
        open={sendRideReq}
        message="Waiting for driver response..."
      />
      <PaymentOptions
        isOpen={paymentModalOpen}
        onSelect={handlePaymentSelection}
      />

      <ChatModal
        messages={messages}
        currentUserId={userId}
        isOpen={chatOn}
        changeOpen={closeChat}
        submit={sendChatMsg}
      />
      <AlertDialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
        {rideInfo && (
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

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] mt-5 mr-5 ml-5 gap-3 md:min-h-[calc(80vh-90px)] lg:min-h-[calc(100vh-90px)] overflow-x-auto">
        {/* Left Section -*/}
        <div className="w-full ">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            {/* Input section for adding location  */}
            {!rideInfo && (
              <>
                <RideLocationsInput
                  handleCheckCabs={handleCheckCabs}
                  handleSuggestionClick={handleSuggestionClick}
                  distance={distance}
                  dropOffCoords={dropOffCoords}
                  pickupCoords={pickupCoords}
                  time={time}
                />
              </>
            )}

            {/* To show the ride info when the drive starts */}
            {rideInfo && (
              <>
                {/* Driver Info */}
                <div className="flex items-center gap-5 mb-5">
                  <img
                    src={Car3D}
                    alt="Car"
                    className="w-24 h-24 rounded-xl object-cover"
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-black">
                      {rideInfo.driver.name}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {rideInfo.driver.vehicleDetails.vehicleModel
                        .charAt(0)
                        .toUpperCase() +
                        rideInfo.driver.vehicleDetails.vehicleModel.slice(1)}
                    </p>
                  </div>
                </div>

                {/* RIDE STARTED */}
                {toDropOff.current ? (
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <h3 className="text-xl font-semibold text-black mb-2">
                      Your ride is in progress
                    </h3>
                    <ul className="text-sm text-gray-700 space-y-1 mb-4">
                      <li>
                        <span className="font-medium text-black">
                          Ride Started At:
                        </span>{" "}
                        {new Date(rideInfo.startedTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </li>
                      <li>
                        <span className="font-medium text-black">
                          Total Distance:
                        </span>{" "}
                        {(rideInfo.distance / 1000).toFixed(2)} km
                      </li>
                      <li>
                        <span className="font-medium text-black">
                          Estimated Duration:
                        </span>{" "}
                        {(rideInfo.estTime / 60).toFixed(0)} mins
                      </li>
                      <li>
                        <span className="font-medium text-black">
                          Estimated Fare:
                        </span>{" "}
                        ₹ {rideInfo.totalFare}
                      </li>
                    </ul>
                  </div>
                ) : (
                  // RIDE NOT STARTED
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-bold text-black flex items-center mb-4">
                      {driverArrived
                        ? "Your driver has arrived at the pickup point"
                        : "Your driver is on the way"}
                    </h3>

                    {driverRoute ? (
                      <ul className="space-y-3 text-base text-gray-700">
                        {!driverArrived && (
                          <>
                            <li>
                              <span className="font-medium text-black">
                                Estimated Arrival:
                              </span>{" "}
                              {(driverRoute.time / 60).toFixed(0)} mins
                            </li>
                            <li>
                              <span className="font-medium text-black">
                                Distance to Pickup:
                              </span>{" "}
                              {(driverRoute.distance / 1000).toFixed(2)} km
                            </li>
                          </>
                        )}

                        <li>
                          <span className="font-medium text-black">
                            OTP for Verification:
                          </span>{" "}
                          <span className="bg-gray-100 text-black font-semibold px-3 py-1 rounded shadow-sm tracking-wider inline-block">
                            {rideInfo.OTP}
                          </span>
                        </li>
                      </ul>
                    ) : (
                      <p className="text-gray-500">Loading driver route...</p>
                    )}

                    <div className="flex flex-col sm:flex-row mt-6 gap-3">
                      <button
                        className="bg-black text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-800 transition duration-200 w-full sm:w-auto flex items-center justify-center gap-2"
                        onClick={() => setChatOn(true)}
                      >
                        <TbMessage className="text-white text-sm" />
                        <span>Message Driver</span>
                      </button>
                      <button
                        className="bg-red-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200 w-full sm:w-auto"
                        onClick={() => setIsCancelOpen(true)}
                      >
                        Cancel Ride
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {noDriversFound && (
            <div className="bg-white mt-2 rounded-2xl text-center py-5 text-gray-500 text-md">
              🚫 No drivers found in your area. Please try again later.
            </div>
          )}
          {availableDrivers && availableDrivers.length > 0 && (
            <AvailableDriverList
              availableDrivers={availableDrivers}
              bookTheCab={bookTheCab}
            />
          )}
        </div>

        {/* Right Section - Map */}
        <div className="w-full min-h-[400px] max-h-[80vh] z-0">
          <MapComponent
            pickupCoords={pickupCoords || null}
            dropOffCoords={dropOffCoords || null}
            routeCoords={isRideStarted ? remainingDropOffRoute : routeCoords}
            availableDrivers={markDrivers}
            driverRoute={
              isRideStarted ? remainingRoute : driverRoute?.formattedRoute
            }
            driverLoc={
              isRideStarted
                ? driverLiveLocation
                : rideInfo?.driver.location.coordinates
            }
            isRideStarted={isRideStarted}
          />
        </div>
      </div>
    </>
  );
};

export default Ride;
