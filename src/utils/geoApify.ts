import axios from "axios";

export const getLocationFromCoords = async (location: [number, number]) => {
  try {
    const apiUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${
      location[0]
    }&lon=${location[1]}&format=json&apiKey=${import.meta.env.VITE_GEOAPI_KEY}`;
    const response = await axios.get(apiUrl);
    console.log(response);
    return (
      response.data.results[0].address_line1 +
      response.data.results[0].address_line2
    );
  } catch (error) {
    console.log(error);

    return undefined;
  }
};

export const getRouteDetails = async (
  pickupCoords: [number, number],
  dropOffCoords: [number, number]
) => {
  try {
    const api = `https://api.geoapify.com/v1/routing?waypoints=${
      pickupCoords[0]
    },${pickupCoords[1]}|${dropOffCoords[0]},${
      dropOffCoords[1]
    }&mode=drive&apiKey=${import.meta.env.VITE_GEOAPI_KEY}&type=short`;
    const response = await axios.get(api);
    const distance = response.data.features[0].properties.distance;
    const time = response.data.features[0].properties.time;
    return { distance, time };
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const fetchRoute = async (
  location1: [number, number],
  location2: [number, number]
) => {
  if (!location1 || !location2) {
    console.warn("Pickup or Drop-off coordinates are missing.");
    return;
  }
  console.log('loc 1 ', location1);
  console.log('loc 2 ', location2);
  
  const api = `https://api.geoapify.com/v1/routing?waypoints=${location1[1]},${location1[0]}|${location2[0]},${location2[1]}&mode=drive&apiKey=${import.meta.env.VITE_GEOAPI_KEY}&type=short`;
  
  try {
    const response = await axios.get(api);
    console.log("Response ", response);

    const coordinates = response.data.features[0].geometry.coordinates;
    const distance:number = response.data.features[0].properties.distance;
    const time:number = response.data.features[0].properties.time;

    const formattedRoute:[number,number][] = coordinates[0].map((coord: [number, number]) => [
      coord[1],
      coord[0],
    ]);
    console.log('from finding driver route ',formattedRoute, distance, time);
    

    return { formattedRoute, distance, time };
  } catch (error) {
    console.error("Error fetching route:", error);
  }
};
