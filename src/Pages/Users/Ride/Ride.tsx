import { useState, useEffect, useRef } from "react";
import NavBar from "@/components/User Comp/NavBar";
import MapComponent from "@/components/MapComp";
import { MdLocationPin } from "react-icons/md";
// import { GeocoderAutocomplete, Location } from "@geoapify/geocoder-autocomplete";
import axios from "axios";
import { message } from "antd";
import { checkCabs } from "@/api/auth/user";
import { Car3D } from "@/Assets";

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
  _id:string
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

const Ride = () => {
  const [input, setInput] = useState("");
  const [dropOff, setDropOff] = useState("");
  const [suggestions, setSuggestions] = useState<LocationData[]>([]);
  const [dropSugg, setDropSugg] = useState<LocationData[]>([]);
  const previousInput = useRef<string>("");
  const previousDropInput = useRef<string>("");
  const [pickupCoords, setPickupCoords] = useState<[number, number] | null>();
  const [dropOffCoords, setDropOffCoords] = useState<[number, number] | null>();
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [distance, setDistance] = useState<number | null>(null);
  const [availableDrivers, setAvailableDrivers] = useState<
    Drivers[] | undefined
  >(undefined);
  const [time, setTime] = useState<number | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [markDrivers, setMarkDrivers] = useState<
    { name: string; coordinates: [number, number] }[] | undefined
  >(undefined);
  const [noDriversFound, setNoDriversFound] = useState<boolean>(false);
  const [noPickUpLoc, setNoPickUpLoc] = useState<boolean>(false);
  const [noDropOffLoc, setNoDropOffLoc] = useState<boolean>(false);

  // const key = "updatable";

  useEffect(() => {
    const trimmedInput = input.trim();
    if (trimmedInput === previousInput.current) return;
    setNoPickUpLoc(false);
    const timer = setTimeout(() => {
      if (trimmedInput) {
        fetchLocations(trimmedInput, "Pickup");
        previousInput.current = trimmedInput;
      } else {
        setSuggestions([]);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [input]);

  useEffect(() => {
    const trimmedInput = dropOff.trim();
    if (trimmedInput === previousDropInput.current) return;
    setNoDropOffLoc(false);
    const timer = setTimeout(() => {
      if (trimmedInput) {
        fetchLocations(trimmedInput, "Drop");
        previousDropInput.current = trimmedInput;
      } else {
        setSuggestions([]);
      }
    }, 1500);

    return () => clearTimeout(timer);
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

  const fetchLocations = async (query: string, type: string) => {
    try {
      const response = await axios.get(
        `https://api.geoapify.com/v1/geocode/autocomplete`,
        {
          params: {
            text: query,
            filter: "rect:77.4656,12.8342,77.7398,13.1431",
            apiKey: "5f91c9c458154879844c3d0447834abf",
          },
        }
      );
      console.log("Fetched data ", response.data.features);
      if (type == "Pickup") {
        if (response.data.features.length == 0) {
          setNoPickUpLoc(true);
        } else {
          setNoPickUpLoc(false);
          setSuggestions(response.data.features);
        }
      } else {
        if (response.data.features.length == 0) {
          setNoDropOffLoc(true);
        } else {
          setNoDropOffLoc(false);
          setDropSugg(response.data.features);
        }
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
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

  const bookTheCab = (driverId:string) =>{
    if (!driverId) {
      messageApi.error('Driver not found')
    }
    

  }

  return (
    <>
      <NavBar />
      {contextHolder}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] mt-5 mr-5 ml-5 gap-3 md:min-h-[calc(80vh-90px)] lg:min-h-[calc(100vh-90px)] overflow-x-auto">
        {/* Left Section -*/}
        <div className="w-full ">
          <div className="bg-white rounded-2xl shadow-xl p-6">
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
                <h3 className="text-lg font-semibold text-blue-600 mb-2">
                  Trip Details
                </h3>
                <p className="text-gray-700">
                  🚗 Estimated Distance:{" "}
                  <span className="font-bold">
                    {(distance / 1000).toFixed(2)} km
                  </span>
                </p>
                <p className="text-gray-700">
                  🕒 Estimated Duration:{" "}
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
                  className="bg-white flex items-center shadow-md rounded-2xl p-3 border border-gray-200 hover:shadow-lg transition duration-300"
                  onClick={()=> bookTheCab(driver._id)}
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
          <div></div>
        </div>

        {/* Right Section - Map */}
        <div className="w-full min-h-[400px] max-h-[80vh]">
          <MapComponent
            pickupCoords={pickupCoords || null}
            dropOffCoords={dropOffCoords || null}
            routeCoords={routeCoords}
            availableDrivers={markDrivers}
          />
        </div>
      </div>
    </>
  );
};

export default Ride;
