import { useState, useEffect, useRef, useCallback } from "react";
import NavBar from "@/components/user/NavBar";
import MapComponent from "@/components/MapComp";
import axios from "axios";
import { message } from "antd";
import { checkCabs } from "@/api/auth/user";
import { socket, RideInfo } from "@/utils/socket";
import { RootState } from "@/redux/store";
import WaitingModal from "@/components/user/WaitingModal";
import { fetchRoute } from "@/utils/geoApify";
import { useDispatch, useSelector } from "react-redux";
import {
  setDriverArrivedInSlice,
  setDriverRouteInSlice,
  setDropOffCoordsInSlice,
  setIsToDropOffInSlice,
  setPickupCoordsInSlice,
  setRemainingDropOffRouteInSlice,
  setRemainingRouteInSlice,
  setRideActive,
  setRideIdInSlice,
  setRideInfoInSlice,
} from "@/redux/slices/rideSlice";
import AvailableDriverList from "@/components/user/AvailableDriverList";
import ChatModal from "@/components/ChatModal";
import { IMessage } from "@/interfaces/chat.interface";
import { CheckCabs, IAvailableCabs } from "@/interfaces/ride.interface";
import RideLocationsInput from "@/components/user/RideLocationsInput";
import { useRide } from "@/hooks/useRide";
import { sliceRouteFromLocation } from "@/utils/sliceRouteFromLocation";
import RideCancelModal from "@/components/RideCancelModal";
import RideInfoCard from "@/components/user/RideInfoCard";

const Ride = () => {
  const {
    chatOn,
    messages,
    rideGotCancelled,
    setChatOn,
    setMessages,
    clearAllStateDataInContext,
    removeAllRideListeners,
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

  // coords from pickup to drop off
  const [routeCoords, setRouteCoords] = useState<
    [number, number][] | undefined
  >([]);

  // driver to pickup location route
  const [remainingRoute, setRemainingRoute] = useState<
    [number, number][] | undefined
  >([]);
  const remainingRouteRef = useRef<[number, number][] | undefined>([]);
  // remaining drop off route
  const [remainingDropOffRoute, setRemainingDropOffRoute] = useState<
    [number, number][] | undefined
  >([]);
  const remainingDropOffRouteRef = useRef<[number, number][] | undefined>([]);

  const [distance, setDistance] = useState<number>();
  const [time, setTime] = useState<number>();

  const [driverLiveLocation, setDriverLiveLocation] =
    useState<[number, number]>();

  const [noDriversFound, setNoDriversFound] = useState<boolean>(false);

  //  Ride
  const [cabsInfo, setCabsInfo] = useState<IAvailableCabs[]>();
  const [sendRideReq, setSendRideReq] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  const {
    isRideActive: isRideStarted,
    rideInfo,
    driverRoute,
    isToDropOff,
    driverArrived,
    dropOffCoords: dropOffCoordsInSlice,
    pickupCoords: pickupCoordsSlice,
    routeCoords: routeCoordsInSlice,
    remainingDropOffRoute: remainingDropOffRouteInSlice,
    remainingRoute: remainingRouteInSlice,
    rideCompleted,
  } = useSelector((state: RootState) => state.ride);

  const clearAllStateData = () => {
    setPickupCoords(undefined);
    setDropOffCoords(undefined);
    setRouteCoords([]);
    setRemainingRoute([]);
    setRemainingDropOffRoute([]);
    remainingRouteRef.current = [];
    remainingDropOffRouteRef.current = [];
    setDistance(undefined);
    setTime(undefined);
    setDriverLiveLocation(undefined);
    setNoDriversFound(false);
    setCabsInfo(undefined);
    setSendRideReq(false);
    setIsCancelOpen(false);
  };

  useEffect(() => {
    remainingRouteRef.current = remainingRoute;
  }, [remainingRoute]);
  useEffect(() => {
    remainingDropOffRouteRef.current = remainingDropOffRoute;
  }, [remainingDropOffRoute]);

  useEffect(() => {
    if (!rideCompleted) {
      if (Array.isArray(routeCoordsInSlice) && routeCoordsInSlice.length > 0)
        setRouteCoords(routeCoordsInSlice);

      if (
        Array.isArray(remainingDropOffRouteInSlice) &&
        remainingDropOffRouteInSlice.length > 0
      ) {
        setRemainingDropOffRoute(remainingDropOffRouteInSlice);
      }

      if (
        Array.isArray(remainingRouteInSlice) &&
        remainingRouteInSlice.length > 0
      )
        setRemainingRoute(remainingRouteInSlice);

      if (pickupCoordsSlice) {
        setPickupCoords(pickupCoordsSlice);
      }
      if (dropOffCoordsInSlice) {
        setDropOffCoords(dropOffCoordsInSlice);
      }
    }
  }, [
    routeCoordsInSlice,
    remainingRouteInSlice,
    remainingDropOffRouteInSlice,
    pickupCoordsSlice,
    dropOffCoordsInSlice,
    isToDropOff,
    rideCompleted,
  ]);

  //* Used to fetch the route between pickup and dropOff when both coordinates given

  useEffect(() => {
    const fetchRoute = async () => {
      if (!pickupCoords || !dropOffCoords) {
        console.warn("Pickup or Drop-off coordinates are missing.");
        return;
      }
      setCabsInfo(undefined);

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
    if (rideGotCancelled || rideCompleted) {
      console.log("Cleared all state data in comp ");

      clearAllStateData();
    }
  }, [rideGotCancelled, rideCompleted]);
  // Handle no response form driver
  const handleNoDriverResponse = useCallback(() => {
    messageApi.info(
      "No drivers responded to your request. Please try again shortly."
    );

    setSendRideReq(false);
  }, [messageApi]);

  const handleRideAccepted = useCallback(
    async (data: RideInfo) => {
      try {
        setSendRideReq(false);
        dispatch(setRideInfoInSlice(data));
        dispatch(setRideIdInSlice(data.rideId));
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

        setDriverLiveLocation(data.driver.location.coordinates);
        dispatch(setDriverRouteInSlice(routeDetails));
        setRemainingRoute(routeDetails.formattedRoute);
        dispatch(setRemainingRouteInSlice(routeDetails.formattedRoute));

        // Use routeCoordsRef if routeCoords might be stale
        dispatch(setRemainingDropOffRouteInSlice(routeCoords));
        messageApi.success(`${data.driver.name} accepted your ride request`);
      } catch (error) {
        if (error instanceof Error)
          messageApi.error(error?.message || "An unexpected error occurred");
      }
    },
    [dispatch, routeCoords, messageApi]
  );

  const handleDriverLocationUpdate = useCallback(
    (data: { type: "toPickup" | "toDropOff"; location: [number, number] }) => {
      if (data.type === "toPickup") {
        setDriverLiveLocation(undefined);
        setRemainingRoute((prev) =>
          prev && prev.length ? sliceRouteFromLocation(prev, data.location) : []
        );
      } else {
        // setDriverArrived(false);
        if (driverArrived) dispatch(setDriverArrivedInSlice(false));
        if (!isToDropOff) dispatch(setIsToDropOffInSlice(true));
        setRemainingDropOffRoute((prev) =>
          prev && prev.length ? sliceRouteFromLocation(prev, data.location) : []
        );
      }
    },
    [dispatch, isToDropOff, driverArrived]
  );
  //! Listen to driver ride response
  useEffect(() => {
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
    handleRideAccepted,
    handleDriverLocationUpdate,
    handleNoDriverResponse,
    dispatch,
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
    clearAllStateDataInContext();
    removeAllRideListeners();
    socket.off("driver-location-update");
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

      <WaitingModal
        open={sendRideReq}
        message="Waiting for driver response..."
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
                toDropOff={isToDropOff}
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
