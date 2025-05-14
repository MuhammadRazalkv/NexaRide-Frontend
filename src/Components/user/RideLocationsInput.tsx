import { LocationData } from "@/interfaces/ride.interface";
import { autoCompleteAddress, getLocationFromCoords } from "@/utils/geoApify";
import { useState, useRef, useEffect } from "react";
import { MdLocationPin } from "react-icons/md";
import { BiCurrentLocation } from "react-icons/bi";
import axios from "axios";
import { message } from "antd";
import Loader from "../Loader";

interface IRideLocationsInputProps {
  handleSuggestionClick: (coordinates: [number, number], type: string) => void;
  time?: number;
  distance?: number;
  handleCheckCabs: () => Promise<void>;
  pickupCoords?: [number, number];
  dropOffCoords?: [number, number];
}

const RideLocationsInput: React.FC<IRideLocationsInputProps> = ({
  handleSuggestionClick,
  time,
  distance,
  handleCheckCabs,
  pickupCoords,
  dropOffCoords,
}) => {
  const [input, setInput] = useState("");
  const [dropOff, setDropOff] = useState("");
  const [suggestions, setSuggestions] = useState<LocationData[]>([]);
  const [dropSugg, setDropSugg] = useState<LocationData[]>([]);
  const [noPickUpLoc, setNoPickUpLoc] = useState<boolean>(false);
  const [noDropOffLoc, setNoDropOffLoc] = useState<boolean>(false);
  const previousInput = useRef<string>("");
  const previousDropInput = useRef<string>("");
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const trimmedInput = input.trim();
    if (trimmedInput === previousInput.current) return;
    setSuggestions([]);
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
      controller.abort();
      clearTimeout(timer);
    };
  }, [input]);

  useEffect(() => {
    const trimmedInput = dropOff.trim();
    if (trimmedInput === previousDropInput.current) return;
    setDropSugg([]);

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

  const fetchLocations = async (
    query: string,
    type: string,
    controller: AbortController
  ) => {
    try {
      const response = await autoCompleteAddress(query, controller);
      if (response) {
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
      }
    } catch (error: unknown) {
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message);
      } else {
        console.error("Error fetching locations:", error);
      }
    }
  };

  const setPlaces = async (place: string, type: string) => {
    if (type === "Pickup") {
      setInput(place);
      previousInput.current = place;
      setSuggestions([]);
    } else {
      setDropOff(place);
      previousDropInput.current = place;
      setDropSugg([]);
    }
  };

  const useCurrentLocation = async () => {
    try {
      if (!navigator.geolocation) {
        messageApi.error("Geolocation is not supported by this browser.");
        return;
      }
      setLoading(true);

      const userLoc = await new Promise<[number, number]>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve([latitude, longitude]);
          },
          (error) => {
            setLoading(false);
            if (error.code === error.PERMISSION_DENIED) {
              messageApi.error("Permission denied to access location");
            } else {
              messageApi.error("Failed to access location");
              console.error("Error getting user location:", error);
            }
            reject(error);
          }
        );
      });

      const response = await getLocationFromCoords(userLoc);
      if (
        (response && response?.city == "Bengaluru") ||
        (response?.state === "Karnataka" &&
          response?.county?.includes("Bangalore"))
      ) {
        const rev: [number, number] = [userLoc[1], userLoc[0]];
        const suggestion = {
          properties: {
            place_id: "current",
            formatted: response as string,
          },
          geometry: {
            coordinates: rev,
          },
        };
        setSuggestions([suggestion]);
        setLoading(false);
      } else {
        setLoading(false);
        messageApi.error(
          "Sorry, no cabs are currently available in your area. Please try again later or move to a nearby location."
        );
      }
    } catch (error) {
      console.error("Error in useCurrentLocation:", error);
    }
  };

  return (
    <>
      {contextHolder}
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
          {loading ? (
            <Loader />
          ) : (
            <BiCurrentLocation size={"30px"} onClick={useCurrentLocation} />
          )}
        </div>

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
            {suggestions.map((item, index) => (
              <li
                key={`${item.properties.place_id}-${index}`}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setPlaces(item.properties.formatted, "Pickup");
                  handleSuggestionClick(item.geometry?.coordinates, "Pickup");
                }}
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
                onClick={() => {
                  setPlaces(item.properties.formatted, "Drop");
                  handleSuggestionClick(item.geometry?.coordinates, "Drop");
                }}
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
        Note: This service is currently available exclusively in Bengaluru.
      </p>

      {time && distance && (
        <div className="bg-gray-50 border border-blue-200 rounded-lg p-4 mt-4 shadow-md">
          <h3 className="text-lg font-semibold text-black mb-2">
            Trip Details
          </h3>
          <p className="text-gray-700">
            Estimated Distance:{" "}
            <span className="font-bold">{(distance / 1000).toFixed(2)} km</span>
          </p>
          <p className="text-gray-700">
            Estimated Duration:{" "}
            <span className="font-bold">{Math.ceil(time / 60)} minutes</span>
          </p>
        </div>
      )}

      <div className="w-full flex items-center justify-center p-2">
        <button
          className="bg-black text-white w-full  p-2 px-4 rounded-xl hover:bg-gray-800 disabled:cursor-not-allowed"
          disabled={!dropOffCoords || !pickupCoords}
          onClick={handleCheckCabs}
        >
          Check cabs
        </button>
      </div>
    </>
  );
};

export default RideLocationsInput;
