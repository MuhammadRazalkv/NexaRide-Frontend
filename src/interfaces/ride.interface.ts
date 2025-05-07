export interface LocationData {
  properties: {
    place_id: string;
    formatted: string;
  };
  geometry: {
    coordinates: [number, number];
  };
}

export interface CheckCabs {
  pickUpPoint: { lat: number; lng: number };
  dropOffPoint: { lat: number; lng: number };
  distance: number;
  time: number;
}

export interface DriverRoute {
  formattedRoute: [number, number][];
  time: number;
  distance: number;
}

export interface Drivers {
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
  avgRating: number;
  totalRatings: number;
  distanceInKm?: string;
  timeInMinutes?: number | string;
}

export interface IAvailableCabs {
  category: string;
  count: number;
  totalFare: number;
}
