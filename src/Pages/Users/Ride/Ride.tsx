import { useState, useEffect, useRef, useCallback } from "react";
import NavBar from "@/components/user/NavBar";
import MapComponent from "@/components/MapComp";
import { MdLocationPin } from "react-icons/md";
// import { GeocoderAutocomplete, Location } from "@geoapify/geocoder-autocomplete";
import axios from "axios";
import { message } from "antd";
import { checkCabs, payUsingStripe, payUsingWallet } from "@/api/auth/user";
import { Car3D } from "@/Assets";
import { socket, connectSocket, RideInfo } from "@/utils/socket";
import { RootState } from "@/Redux/store";
// import Loader from "@/components/Loader";
import WaitingModal from "@/components/user/WaitingModal";
import { fetchRoute } from "@/utils/geoApify";
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
import { setInPayment, setRideIdInSlice } from "@/Redux/slices/rideSlice";

interface LocationData {
  properties: {
    place_id: string;
    formatted: string;
  };
  geometry: {
    coordinates: [number, number];
  };
}

interface CheckCabs {
  pickUpPoint: { lat: number; lng: number };
  dropOffPoint: { lat: number; lng: number };
  distance: number;
  time: number;
}

interface Drivers {
  _id: string;
  name: string;
  totalFare: number;
  location: {
    type: string;
    coordinates: [number, number];
  };
  vehicleDetails: {
    brand: string;
    vehicleModel: string;
    color: string;
    category: string;
  };
  distanceInKm?: string;
  timeInMinutes?: number | string;
}

interface DriverRoute {
  formattedRoute: [number, number][];
  time: number;
  distance: number;
}

const Ride = () => {
  const [input, setInput] = useState("");
  const [dropOff, setDropOff] = useState("");
  const [suggestions, setSuggestions] = useState<LocationData[]>([]);
  const [dropSugg, setDropSugg] = useState<LocationData[]>([]);
  const previousInput = useRef<string>("");
  const previousDropInput = useRef<string>("");
  const [pickupCoords, setPickupCoords] = useState<[number, number] | null>(
    null
  );
  const [dropOffCoords, setDropOffCoords] = useState<[number, number] | null>(
    null
  );
  const [routeCoords, setRouteCoords] = useState<
    [number, number][] | undefined
  >([]);
  const routeCoordsRef = useRef<[number, number][] | undefined>([]);
  const [distance, setDistance] = useState<number | null>(null);
  const [availableDrivers, setAvailableDrivers] = useState<
    Drivers[] | undefined
  >(undefined);
  const [time, setTime] = useState<number | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [markDrivers, setMarkDrivers] = useState<
    | { driverId: string; name: string; coordinates: [number, number] }[]
    | undefined
  >(undefined);
  const [noDriversFound, setNoDriversFound] = useState<boolean>(false);
  const [noPickUpLoc, setNoPickUpLoc] = useState<boolean>(false);
  const [noDropOffLoc, setNoDropOffLoc] = useState<boolean>(false);
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

  const rideIdFromSlice = useSelector((state: RootState) => state.ride.rideId);
  const inPayment = useSelector((state: RootState) => state.ride.inPayment);
  useEffect(() => {
    if (inPayment) {
      setPaymentModalOpen(true)
      setRideId(rideIdFromSlice)
    }
  }, [rideIdFromSlice,inPayment]);
  
  useEffect(() => {
    sendRideReqRef.current = sendRideReq;
  }, [sendRideReq]);

  useEffect(() => {
    routeCoordsRef.current = routeCoords;
  }, [routeCoords]);

  useEffect(() => {
    const trimmedInput = input.trim();
    if (trimmedInput === previousInput.current) return;

    setNoPickUpLoc(false);
    const controller = new AbortController();

    const timer = setTimeout(() => {
      if (trimmedInput) {
        fetchLocations(trimmedInput, "Pickup", controller);
        previousInput.current = trimmedInput;
      } else {
        setSuggestions([]);
      }
    }, 1500);

    return () => {
      controller.abort(); // Cancel ongoing requests
      clearTimeout(timer);
    };
  }, [input]);

  useEffect(() => {
    const trimmedInput = dropOff.trim();
    if (trimmedInput === previousDropInput.current) return;

    setNoDropOffLoc(false);
    const controller = new AbortController();

    const timer = setTimeout(() => {
      if (trimmedInput) {
        fetchLocations(trimmedInput, "Drop", controller);
        previousDropInput.current = trimmedInput;
      } else {
        setDropSugg([]);
      }
    }, 1500);

    return () => {
      controller.abort(); // Cancel ongoing requests
      clearTimeout(timer);
    };
  }, [dropOff]);

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
        console.log("Response ", response);

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

  // * Handle no response form driver
  const handleNoDriverResponse = useCallback(() => {
    messageApi.info("Driver did not respond. Please try again.");
    sendRideReqRef.current = false;
    setSendRideReq(false);
  }, [messageApi]);


  //! Listen to driver ride response
  useEffect(() => {
    if (!token) {
      messageApi.error("Token missing. Please ensure you are logged in.");
      
      return
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
      console.log("Ride got cancelled");
      messageApi.error("The ride was cancelled by the driver");
      setInput("");
      setDropOff("");
      setPickupCoords(null);
      setDropOffCoords(null);
      setRouteCoords(undefined);
      setDistance(null);
      setTime(null);
      setRideInfo(null);
      setDriverRoute(undefined);
      setIsRideStarted(false);
      setDriverArrived(false);
      setRemainingDropOffRoute(undefined);
      setRemainingRoute(undefined);
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

    const handlePaymentSuccess = async ()=>{
      console.log('Payment success from user side');
      
      dispatch(setRideIdInSlice(''));
      dispatch(setInPayment(false));
      setPaymentModalOpen(false)
      setRideId(undefined)
      clearAllStateData()
    }

    socket.on("ride-rejected", handleRideRejected);
    socket.on("no-driver-response", handleNoDriverResponse);
    socket.on("ride-accepted", handleRideAccepted);
    socket.on("driver-location-update", handleDriverLocationUpdate);
    socket.on("driver-reached", handleDriverReached);
    socket.on("ride-cancelled", handleRideCancelled);
    socket.on("dropOff-reached", handleDropOffReached);
    socket.on('payment-success',handlePaymentSuccess)
    return () => {
      socket.off("ride-rejected", handleRideRejected);
      socket.off("no-driver-response", handleNoDriverResponse);
      socket.off("ride-accepted", handleRideAccepted);
      socket.off("driver-location-update", handleDriverLocationUpdate);
      socket.off("driver-reached", handleDriverReached);
      socket.off("ride-cancelled", handleRideCancelled);
      socket.off('payment-success')
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      console.log("Comp unmounting");
    };
  }, [messageApi, handleNoDriverResponse,dispatch,token]);

  const fetchLocations = async (
    query: string,
    type: string,
    controller: AbortController
  ) => {
    try {
      const response = await axios.get(
        `https://api.geoapify.com/v1/geocode/autocomplete`,
        {
          params: {
            text: query,
            filter: "rect:77.4656,12.8342,77.7398,13.1431",
            apiKey: "5f91c9c458154879844c3d0447834abf",
          },
          signal: controller.signal,
        }
      );

      if (type === "Pickup") {
        if (response.data.features.length === 0) {
          setNoPickUpLoc(true);
        } else {
          setNoPickUpLoc(false);
          setSuggestions(response.data.features);
        }
      } else {
        if (response.data.features.length === 0) {
          setNoDropOffLoc(true);
        } else {
          setNoDropOffLoc(false);
          setDropSugg(response.data.features);
        }
      }
    } catch (error: unknown) {
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message);
      } else {
        console.error("Error fetching locations:", error);
      }
    }
  };

  const handleSuggestionClick = (
    place: string,
    coordinates: [number, number],
    type: string
  ) => {
    if (!coordinates) {
      console.warn("Coordinates are undefined or missing");
      return;
    }

    if (type === "Pickup") {
      console.log("Co ", coordinates);
      setPickupCoords([coordinates[1], coordinates[0]]);
      setInput(place);
      previousInput.current = place;
      setSuggestions([]);
    } else {
      setDropOff(place);
      setDropOffCoords([coordinates[1], coordinates[0]]);
      previousDropInput.current = place;
      setDropSugg([]);
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
        console.log("Else case in check cabs");

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
    const api = `https://api.geoapify.com/v1/routing?waypoints=${driverCoords[1]},${driverCoords[0]}|${pickupCoords[0]},${pickupCoords[1]}&mode=drive&apiKey=5f91c9c458154879844c3d0447834abf&type=short`;

    try {
      const response = await axios.get(api);

      if (response && response.data) {
        const { distance, time } = response.data.features[0].properties;
        const distanceInKm = (distance / 1000).toFixed(1);
        const timeInMinutes = Math.round(time / 60);
        return { distanceInKm, timeInMinutes };
      }
      return { distanceInKm: "N/A", timeInMinutes: "N/A" };
    } catch (error) {
      console.error("Error fetching route:", error);
      return undefined; // Ensures consistency with the return type
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
    setInput("");
    setDropOff("");
    setPickupCoords(null);
    setDropOffCoords(null);
    setRouteCoords(undefined);
    setDistance(null);
    setTime(null);
    setRideInfo(null);
    setDriverRoute(undefined);
    setIsRideStarted(false);
    setDriverArrived(false);
    setRemainingDropOffRoute(undefined);
    setRemainingRoute(undefined);
    socket.off("driver-location-update");
  };

  const clearAllStateData = () => {
    setInput("");
    setDropOff("");
    setPickupCoords(null);
    setDropOffCoords(null);
    setRouteCoords(undefined);
    setDistance(null);
    setTime(null);
    setRideInfo(null);
    setDriverRoute(undefined);
    setIsRideStarted(false);
    setDriverArrived(false);
    setRemainingDropOffRoute(undefined);
    setRemainingRoute(undefined);
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
          clearAllStateData();
          dispatch(setRideIdInSlice(''));
          dispatch(setInPayment(false));
          setRideId(undefined)
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

  return (
    <>
      <NavBar />
      {contextHolder}

      <WaitingModal
        open={sendRideReq}
        message="Waiting for driver response..."
      />
      <PaymentOptions
        isOpen={paymentModalOpen}
        onSelect={handlePaymentSelection}
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
                <div className="relative w-full">
                  <div className="flex items-center gap-2 p-2">
                    <MdLocationPin />
                    <input
                      type="text"
                      className="w-full px-2 rounded-2xl border border-gray-300 focus:border-blue-500 focus:outline-none text-sm placeholder:text-black p-3"
                      placeholder="Pickup location"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    />
                  </div>

                  {/* Suggestions Dropdown */}
                  {suggestions.length > 0 && (
                    <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                      {suggestions.map((item, index) => (
                        <li
                          key={`${item.properties.place_id}-${index}`}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() =>
                            handleSuggestionClick(
                              item.properties.formatted,
                              item.geometry?.coordinates,
                              "Pickup"
                            )
                          }
                        >
                          {item.properties.formatted}
                        </li>
                      ))}
                    </ul>
                  )}

                  {noPickUpLoc && (
                    <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                      <li className="p-2 hover:bg-gray-100 cursor-pointer">
                        🚫 Location not found
                      </li>
                    </ul>
                  )}
                </div>

                <div className="relative w-full">
                  <div className="flex items-center gap-2 p-2">
                    <MdLocationPin />
                    <input
                      type="text"
                      className="w-full px-2 rounded-2xl border border-gray-300 focus:border-blue-500 focus:outline-none text-sm placeholder:text-black p-3"
                      placeholder="Drop off location"
                      value={dropOff}
                      onChange={(e) => setDropOff(e.target.value)}
                    />
                  </div>

                  {dropSugg.length > 0 && (
                    <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                      {dropSugg.map((item, index) => (
                        <li
                          key={`${item.properties.place_id}-${index}`}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() =>
                            handleSuggestionClick(
                              item.properties.formatted,
                              item.geometry?.coordinates,
                              "Drop"
                            )
                          }
                        >
                          {item.properties.formatted}
                        </li>
                      ))}
                    </ul>
                  )}
                  {noDropOffLoc && (
                    <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                      <li className="p-2 hover:bg-gray-100 cursor-pointer">
                        🚫 Location not found
                      </li>
                    </ul>
                  )}
                </div>

                <p className="text-xs italic text-center sm:text-left">
                  Note: This service is currently available exclusively in
                  Bengaluru.
                </p>

                {time && distance && (
                  <div className="bg-gray-50 border border-blue-200 rounded-lg p-4 mt-4 shadow-md">
                    <h3 className="text-lg font-semibold text-black mb-2">
                      Trip Details
                    </h3>
                    <p className="text-gray-700">
                      Estimated Distance:{" "}
                      <span className="font-bold">
                        {(distance / 1000).toFixed(2)} km
                      </span>
                    </p>
                    <p className="text-gray-700">
                      Estimated Duration:{" "}
                      <span className="font-bold">
                        {Math.ceil(time / 60)} minutes
                      </span>
                    </p>
                  </div>
                )}

                <div className="w-full flex items-center justify-center p-2">
                  <button
                    className="bg-black text-white w-full sm:w-auto p-2 px-4 rounded-xl hover:bg-gray-800 disabled:cursor-not-allowed"
                    disabled={!dropOffCoords || !pickupCoords}
                    onClick={handleCheckCabs}
                  >
                    Check cabs
                  </button>
                </div>
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
                      <button className="bg-black text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-800 transition duration-200 w-full sm:w-auto flex items-center justify-center gap-2">
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
            <div className="grid grid-cols-1 bg-gray-50 mt-2 rounded-2xl gap-4 p-4">
              {availableDrivers.map((driver, index) => (
                <div
                  key={index}
                  className="bg-white flex items-center hover:bg-gray-200 shadow-md rounded-2xl p-3 border border-gray-200 hover:shadow-lg transition duration-300"
                  onClick={() => bookTheCab(driver._id, driver.totalFare)}
                >
                  <img
                    src={Car3D}
                    alt="car model"
                    className="h-28 w-28 object-contain rounded-lg p-2"
                  />

                  <div className="ml-4 w-full">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {driver.name}
                    </h3>

                    <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
                      <div>
                        <p className="font-medium">
                          {driver.vehicleDetails.vehicleModel}
                        </p>
                        <p className="text-xs text-gray-500">
                          {driver.vehicleDetails.category}
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-bold">
                          ₹{driver.totalFare}
                        </p>
                        {driver.distanceInKm && driver.timeInMinutes && (
                          <p className="text-xs text-gray-500">
                            {driver.distanceInKm} km • {driver.timeInMinutes}{" "}
                            min
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
