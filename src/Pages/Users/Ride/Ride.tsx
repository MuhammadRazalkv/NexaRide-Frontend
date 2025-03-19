import { useState, useEffect, useRef } from "react";
import NavBar from "@/components/User Comp/NavBar";
import MapComponent from "@/components/MapComp";
import { MdLocationPin } from "react-icons/md";
// import { GeocoderAutocomplete, Location } from "@geoapify/geocoder-autocomplete";
import axios from "axios";


interface LocationData {
  properties: {
    place_id: string;
    formatted: string;
  };
  geometry: {
    coordinates: [number, number]
  }
}

const Ride = () => {
  // const [pickupLocation, setPickupLocation] = useState("");
  // const [dropOffLocation, setDropOffLocation] = useState("");

  // const pickupRef = useRef<HTMLDivElement>(null);
  // const dropOffRef = useRef<HTMLDivElement>(null);

  // const [pickupCoords, setPickupCoords] = useState<[number, number] | null>(null);
  // const [dropOffCoords, setDropOffCoords] = useState<[number, number] | null>(null);

  const [input, setInput] = useState('')
  const [dropOff, setDropOff] = useState('')
  const [suggestions, setSuggestions] = useState<LocationData[]>([])
  const [dropSugg, setDropSugg] = useState<LocationData[]>([])
  const previousInput = useRef<string>('');
  const previousDropInput = useRef<string>('');
  const [pickupCoords, setPickupCoords] = useState<[number, number] | null>()
  const [dropOffCoords, setDropOffCoords] = useState<[number, number] | null>()
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [distance, setDistance] = useState<number | null>(null)
  const [time, setTime] = useState<number | null>(null)

  useEffect(() => {
    const trimmedInput = input.trim();
    if (trimmedInput === previousInput.current) return;

    const timer = setTimeout(() => {
      if (trimmedInput) {
        fetchLocations(trimmedInput, 'Pickup');
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

    const timer = setTimeout(() => {
      if (trimmedInput) {
        fetchLocations(trimmedInput, 'Drop');
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

      const api = `https://api.geoapify.com/v1/routing?waypoints=${pickupCoords[0]},${pickupCoords[1]}|${dropOffCoords[0]},${dropOffCoords[1]}&mode=drive&apiKey=5f91c9c458154879844c3d0447834abf&type=short`;

      try {
        const response = await axios.get(api)
        console.log('Response ', response);

        const coordinates = response.data.features[0].geometry.coordinates;
        const distance = response.data.features[0].properties.distance;
        const time = response.data.features[0].properties.time;
        setTime(time)
        setDistance(distance)
        console.log('Coordinates ', coordinates);

        const formattedRoute = coordinates[0].map((coord: [number, number]) => [coord[1], coord[0]]);
        console.log('Formated route ', formattedRoute);

        setRouteCoords(formattedRoute);
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    };

    if (pickupCoords && dropOffCoords) {
      fetchRoute()
    }
  }, [pickupCoords, dropOffCoords])


  const fetchLocations = async (query: string, type: string) => {
    try {
      const response = await axios.get(
        `https://api.geoapify.com/v1/geocode/autocomplete`,
        {
          params: {
            text: query,
            filter: 'rect:77.4656,12.8342,77.7398,13.1431',
            apiKey: '5f91c9c458154879844c3d0447834abf'
          }
        }
      );
      console.log('Fetched data ', response.data.features);
      if (type == 'Pickup') {
        setSuggestions(response.data.features);
      } else {
        setDropSugg(response.data.features)
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const handleSuggestionClick = (place: string, coordinates: [number, number], type: string) => {
    if (!coordinates) {
      console.warn("Coordinates are undefined or missing");
      return;
    }

    if (type === 'Pickup') {
      console.log("Co ", coordinates);
      setPickupCoords([coordinates[1], coordinates[0]])
      setInput(place);
      previousInput.current = place;
      setSuggestions([]);
    } else {
      setDropOff(place);
      setDropOffCoords([coordinates[1], coordinates[0]])
      previousDropInput.current = place;
      setDropSugg([]);
    }
  };


  return (
<>
  <NavBar />
  <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] mt-5 mr-5 ml-5 gap-3 md:min-h-[calc(80vh-90px)] lg:min-h-[calc(100vh-90px)] overflow-x-auto">

    {/* Left Section -*/}
    <div className="w-full ">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        {/* Input Fields */}
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
                    handleSuggestionClick(item.properties.formatted, item.geometry?.coordinates, "Pickup")
                  }
                >
                  {item.properties.formatted}
                </li>
              ))}
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
                    handleSuggestionClick(item.properties.formatted, item.geometry?.coordinates, "Drop")
                  }
                >
                  {item.properties.formatted}
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="text-xs italic text-center sm:text-left">
          Note: This service is currently available exclusively in Bengaluru.
        </p>

        {time && distance && (
          <div className="bg-gray-50 border border-blue-200 rounded-lg p-4 mt-4 shadow-md">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">
              Trip Details
            </h3>
            <p className="text-gray-700">
              🚗 Estimated Distance:{" "}
              <span className="font-bold">{(distance / 1000).toFixed(2)} km</span>
            </p>
            <p className="text-gray-700">
              🕒 Estimated Duration:{" "}
              <span className="font-bold">{Math.ceil(time / 60)} minutes</span>
            </p>
          </div>
        )}

        <div className="w-full flex items-center justify-center p-2">
          <button
            className="bg-black text-white w-full sm:w-auto p-2 px-4 rounded-xl hover:bg-gray-800 disabled:cursor-not-allowed"
            disabled={!dropOffCoords || !pickupCoords}
          >
            Check cabs
          </button>
        </div>
      </div>
    </div>

    {/* Right Section - Map */}
    <div className="w-full min-h-[400px] max-h-[80vh]">
      <MapComponent
        pickupCoords={pickupCoords || null}
        dropOffCoords={dropOffCoords || null}
        routeCoords={routeCoords}
      />
    </div>
  </div>
</>

  
  );
};

export default Ride;
