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
import { socket, RideInfo } from "@/utils/socket";
import { RootState } from "@/redux/store";
import WaitingModal from "@/components/user/WaitingModal";
import { fetchRoute } from "@/utils/geoApify";

import PaymentOptions from "@/components/user/PaymentOptions";
import { useDispatch, useSelector } from "react-redux";
import {
  resetRide,
  setDriverRouteInSlice,
  setDropOffCoordsInSlice,
  setInPaymentInSlice,
  setIsToDropOffInSlice,
  setPickupCoordsInSlice,
  setRemainingDropOffRouteInSlice,
  setRemainingRouteInSlice,
  setRideActive,
  setRideIdInSlice,
  setRideInfoInSlice,
} from "@/redux/slices/rideSlice";
import RatingModal from "@/components/RatingModal";

import AvailableDriverList from "@/components/user/AvailableDriverList";
import ChatModal from "@/components/ChatModal";
import { IMessage } from "@/interfaces/chat.interface";
import {
  CheckCabs,
  DriverRoute,
  IAvailableCabs,
} from "@/interfaces/ride.interface";
import RideLocationsInput from "@/components/user/RideLocationsInput";
import { useRide } from "@/hooks/useRide";
import { sliceRouteFromLocation } from "@/utils/sliceRouteFromLocation";
import RideCancelModal from "@/components/RideCancelModal";
import RideInfoCard from "@/components/user/RideInfoCard";

const Ride = () => {
  const {
    chatOn,
    driverArrived,
    isRateModalOpen,
    isRideStarted,
    messages,
    paymentModalOpen,
    rideId,
    rideInfo,
    rideGotCancelled,
    setRideInfo,
    setDriverArrived,
    setIsRideStarted,
    setIsRateModalOpen,
    setPaymentModalOpen,
    setChatOn,
    setMessages,
    clearAllStateDataInContext,
    setRideId
  } = useRide();

  //  Ant Design message API
  const [messageApi, contextHolder] = message.useMessage();

  //  Auth & Redux
  const token = useSelector((state: RootState) => state.auth.token);
  const userId = useSelector((state: RootState) => state.auth.user?._id);
  const dispatch = useDispatch();

  //  Location & Routing
  const [pickupCoords, setPickupCoords] = useState<[number, number]>();
  const [dropOffCoords, setDropOffCoords] = useState<[number, number]>();
  const [routeCoords, setRouteCoords] = useState<
    [number, number][] | undefined
  >([]);
  const routeCoordsRef = useRef<[number, number][] | undefined>([]);
  const [remainingRoute, setRemainingRoute] = useState<
    [number, number][] | undefined
  >([]);
  const remainingRouteRef = useRef<[number, number][] | undefined>([]);

  const [remainingDropOffRoute, setRemainingDropOffRoute] = useState<
    [number, number][] | undefined
  >([]);
  const remainingDropOffRouteRef = useRef<[number, number][] | undefined>([]);

  const [distance, setDistance] = useState<number>();
  const [time, setTime] = useState<number>();

  const [markDrivers, setMarkDrivers] = useState<
    | { driverId: string; name: string; coordinates: [number, number] }[]
    | undefined
  >(undefined);

  const [driverRoute, setDriverRoute] = useState<DriverRoute | undefined>(
    undefined
  );
  const [driverLiveLocation, setDriverLiveLocation] =
    useState<[number, number]>();
  const [noDriversFound, setNoDriversFound] = useState<boolean>(false);

  //  Ride
  const [cabsInfo, setCabsInfo] = useState<IAvailableCabs[]>();
  const [sendRideReq, setSendRideReq] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const sendRideReqRef = useRef(false);
  const toDropOff = useRef(false);

  //  Rating & Review
  const [rating, setRating] = useState(0);
  const [reviewComments, setReviewComments] = useState("");
  const [ratingErr, setRatingError] = useState("");

  //  Redux - Ride Slice
  const existingRideInfo = useSelector(
    (state: RootState) => state.ride.rideInfo
  );
  const routeCoordsInSlice = useSelector(
    (state: RootState) => state.ride.routeCoords
  );
  const driverRouteInfoSlice = useSelector(
    (state: RootState) => state.ride.driverRoute
  );
  const remainingDropOffRouteInSlice = useSelector(
    (state: RootState) => state.ride.remainingDropOffRoute
  );
  const remainingRouteInSlice = useSelector(
    (state: RootState) => state.ride.remainingRoute
  );
  const isRideActive = useSelector(
    (state: RootState) => state.ride.isRideActive
  );
  const driverReached = useSelector(
    (state: RootState) => state.ride.driverArrived
  );
  const dropOffCoordsInSlice = useSelector(
    (state: RootState) => state.ride.dropOffCoords
  );

  const pickupCoordsSlice = useSelector(
    (state: RootState) => state.ride.pickupCoords
  );

  const inPaymentSlice = useSelector(
    (state: RootState) => state.ride.inPayment
  );
  const rideIdInSlice = useSelector((state:RootState)=> state.ride.rideId) 
  const isToDropOff = useSelector((state: RootState) => state.ride.isToDropOff);

  const clearAllStateData = () => {
    setPickupCoords(undefined);
    setDropOffCoords(undefined);
    setRouteCoords(undefined);
    setDistance(undefined);
    setTime(undefined);
    setDriverRoute(undefined);
    setRemainingDropOffRoute(undefined);
    setRemainingRoute(undefined);
  };

  useEffect(() => {
    remainingRouteRef.current = remainingRoute;
  }, [remainingRoute]);
  useEffect(() => {
    remainingDropOffRouteRef.current = remainingDropOffRoute;
  }, [remainingDropOffRoute]);

  useEffect(() => {
    if (isRideActive) setIsRideStarted(true);

    if (existingRideInfo) setRideInfo(existingRideInfo);

    if (Array.isArray(routeCoordsInSlice) && routeCoordsInSlice.length > 0)
      setRouteCoords(routeCoordsInSlice);

    if (driverRouteInfoSlice) setDriverRoute(driverRouteInfoSlice);

    if (
      Array.isArray(remainingDropOffRouteInSlice) &&
      remainingDropOffRouteInSlice.length > 0
    ) {
      console.log("setting remainingDropOffRouteInSlice ");
      setRemainingDropOffRoute(remainingDropOffRouteInSlice);
    }

    if (
      Array.isArray(remainingRouteInSlice) &&
      remainingRouteInSlice.length > 0
    )
      setRemainingRoute(remainingRouteInSlice);

    if (driverReached) setDriverArrived(true);

    if (isToDropOff) {
      toDropOff.current = true;
      setRemainingRoute(undefined);
    }
    if (pickupCoordsSlice) {
      setPickupCoords(pickupCoordsSlice);
    }
    if (dropOffCoordsInSlice) {
      setDropOffCoords(dropOffCoordsInSlice);
    }
    if (inPaymentSlice) {
      setPaymentModalOpen(true);
    }
    // }
  }, [
    isRideActive,
    setIsRideStarted,
    existingRideInfo,
    routeCoordsInSlice,
    driverRouteInfoSlice,
    remainingRouteInSlice,
    remainingDropOffRouteInSlice,
    pickupCoordsSlice,
    dropOffCoordsInSlice,
    setRideInfo,
    driverReached,
    setDriverArrived,
    inPaymentSlice,
    setPaymentModalOpen,
    isToDropOff,
  ]);

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
      setCabsInfo(undefined);
      setMarkDrivers(undefined);

      const api = `https://api.geoapify.com/v1/routing?waypoints=${pickupCoords[0]},${pickupCoords[1]}|${dropOffCoords[0]},${dropOffCoords[1]}&mode=drive&apiKey=5f91c9c458154879844c3d0447834abf&type=short`;

      try {
        const response = await axios.get(api);
        const coordinates = response.data.features[0].geometry.coordinates;
        const distance = response.data.features[0].properties.distance;
        const time = response.data.features[0].properties.time;
        if (distance < 1000) {
          const shortDist = (distance / 1000).toFixed(2);
          message.error(
            `The ride distance is only ${shortDist} km. Minimum required is 1 km.`
          );
          return;
        }
        setTime(time);
        setDistance(distance);

        const formattedRoute = coordinates[0].map((coord: [number, number]) => [
          coord[1],
          coord[0],
        ]);

        setRouteCoords(formattedRoute);
      } catch (error) {
        message.error("Failed to fetch route");
        console.error("Error fetching route:", error);
      }
    };

    if (pickupCoords && dropOffCoords) {
      fetchRoute();
    }
  }, [pickupCoords, dropOffCoords]);

  useEffect(() => {
    if (rideGotCancelled) {
      clearAllStateData();
    }
  }, [rideGotCancelled]);
  // Handle no response form driver
  const handleNoDriverResponse = useCallback(() => {
    messageApi.info(
      "No drivers responded to your request. Please try again shortly."
    );
    sendRideReqRef.current = false;
    setSendRideReq(false);
  }, [messageApi]);

  //! Listen to driver ride response
  useEffect(() => {
    const stopSendingRequest = () => setSendRideReq(false);
    //* Handle driver ride acceptance
    const handleRideAccepted = async (data: RideInfo) => {
      try {

        sendRideReqRef.current = false;
        stopSendingRequest();
        setMarkDrivers(undefined);

        setRideInfo(data);
        dispatch(setRideInfoInSlice(data));
        dispatch(setRideIdInSlice(data.rideId));

        setIsRideStarted(true);
        dispatch(setRideActive(true));

        dispatch(setPickupCoordsInSlice(data.pickupCoords));
        dispatch(setDropOffCoordsInSlice(data.dropOffCoords));
        const routeDetails = await fetchRoute(
          data.driver.location.coordinates,
          data.pickupCoords
        );

        if (!routeDetails) {
          throw new Error("Failed to calculate driver route");
        }

        // Used to to show the drivers location before starting the ride
        setDriverLiveLocation(data.driver.location.coordinates);

        // To show the drivers info such as how long , distance and route
        setDriverRoute(routeDetails);
        dispatch(setDriverRouteInSlice(routeDetails));

        // The remaining route of the driver to pickup
        setRemainingRoute(routeDetails.formattedRoute);
        dispatch(setRemainingRouteInSlice(routeDetails.formattedRoute));

        // The remaining route from pickup to drop off

        setRemainingDropOffRoute(routeCoordsRef.current);
        dispatch(setRemainingDropOffRouteInSlice(routeCoordsRef.current));

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
      console.log("Driver location update ");

      if (data.type == "toPickup") {
        const location = data.location;
        setDriverLiveLocation(undefined);

        setRemainingRoute((prevRoute) => {
          if (!prevRoute || prevRoute.length === 0) return [];
          const updatedRoute = sliceRouteFromLocation(prevRoute, location);
          return updatedRoute;
        });
      } else if (data.type == "toDropOff") {
        toDropOff.current = true;
        setDriverArrived(false);

        dispatch(setIsToDropOffInSlice(true));
        setRemainingDropOffRoute((prevRoute) => {
          if (!prevRoute || prevRoute.length === 0) return [];
          const updatedRoute = sliceRouteFromLocation(prevRoute, data.location);
          return updatedRoute;
        });
      }
    };
    socket.on("no-driver-response", handleNoDriverResponse);
    socket.on("ride-accepted", handleRideAccepted);
    socket.on("driver-location-update", handleDriverLocationUpdate);
    return () => {
      socket.off("no-driver-response", handleNoDriverResponse);
      socket.off("ride-accepted", handleRideAccepted);
      socket.off("driver-location-update", handleDriverLocationUpdate);
      dispatch(setRemainingRouteInSlice(remainingRouteRef.current));
      dispatch(
        setRemainingDropOffRouteInSlice(remainingDropOffRouteRef.current)
      );
    };
  }, [
    messageApi,
    handleNoDriverResponse,
    setIsRideStarted,
    dispatch,
    setRideInfo,
    setDriverArrived,
  ]);

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

      if (res.success && res.availableCabs.length > 0) {
        setNoDriversFound(false);
        setCabsInfo(res.availableCabs);
      } else {
        setCabsInfo(undefined);
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

  const bookTheCab = (
    category: string,
    fare: number,
    offerId: string | null
  ) => {
    sendRideReqRef.current = false;
    if (!category) {
      messageApi.error("Category not found");
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

    socket.emit("request-ride", {
      category,
      pickupCoords,
      dropOffCoords,
      offerId,
      time,
      distance,
      fare,
    });
    setSendRideReq(true);
  };

  const cancelTheRide = () => {
    socket.emit("cancel-ride", "user");
    clearAllStateData();
    setChatOn(false);
    clearAllStateDataInContext();
    dispatch(resetRide());
    socket.off("driver-location-update");
  };

  const handlePaymentSelection = async (method: "wallet" | "stripe") => {
    console.log("Ride id ", rideId);
    if (!rideId && rideIdInSlice) {
      setRideId(rideIdInSlice)
    }
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
          dispatch(setInPaymentInSlice(false));
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
    clearAllStateDataInContext();
    setIsRateModalOpen(false);
    dispatch(resetRide());
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
        clearAllStateDataInContext();
        dispatch(resetRide());
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

      {isCancelOpen && (
        <RideCancelModal
          cancelTheRide={cancelTheRide}
          isCancelOpen={isCancelOpen}
          rideInfo={rideInfo}
          setIsCancelOpen={setIsCancelOpen}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] mt-5 mr-5 ml-5 gap-3 md:min-h-[calc(80vh-90px)] lg:min-h-[calc(100vh-90px)] overflow-x-auto">
        {/* Left Section -*/}
        <div className="w-full ">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            {/* Input section for adding location  */}
            {!rideInfo && (
              <RideLocationsInput
                handleCheckCabs={handleCheckCabs}
                handleSuggestionClick={handleSuggestionClick}
                distance={distance}
                dropOffCoords={dropOffCoords}
                pickupCoords={pickupCoords}
                time={time}
              />
            )}

            {/* To show the ride info when the drive starts */}
            {rideInfo && (
              <RideInfoCard
                driverArrived={driverArrived}
                driverRoute={driverRoute}
                rideInfo={rideInfo}
                setChatOn={setChatOn}
                setIsCancelOpen={setIsCancelOpen}
                toDropOff={toDropOff}
              />
            )}
          </div>

          {noDriversFound && (
            <div className="bg-white mt-2 rounded-2xl text-center py-5 text-gray-500 text-md">
              🚫 No drivers found in your area. Please try again later.
            </div>
          )}
          {cabsInfo && cabsInfo.length > 0 && (
            <AvailableDriverList
              availableCabs={cabsInfo}
              bookTheCab={bookTheCab}
            />
          )}
        </div>

        {/* Right Section - Map */}
        <div className="w-full min-h-[400px] max-h-[80vh] z-0">
          <MapComponent
            // markers
            pickupCoords={pickupCoords || null}
            dropOffCoords={dropOffCoords || null}
            // drivers location markers
            availableDrivers={markDrivers}
            // routes
            routeCoords={isRideStarted ? remainingDropOffRoute : routeCoords}
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
