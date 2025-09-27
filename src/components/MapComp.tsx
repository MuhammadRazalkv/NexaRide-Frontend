import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import L, { Icon } from "leaflet";
import { driverPopUp } from "@/assets";

interface MapComponentProps {
  pickupCoords?: [number, number];
  dropOffCoords?: [number, number];
  routeCoords?: [number, number][];
  // driverLoc?: [number, number];
  // availableDrivers?: {
  //   name: string;
  //   coordinates: [number, number];
  // }[];
  driverRoute?: [number, number][];
  isRideStarted?: boolean;
  currentLocation?: [number, number];
}

const MapComponent: React.FC<MapComponentProps> = ({
  pickupCoords,
  dropOffCoords,
  routeCoords,
  // driverLoc,
  // availableDrivers,
  driverRoute,
  isRideStarted = false,
  currentLocation,
}) => {
  const defaultPosition: [number, number] = [12.9716, 77.5946];
  const driverIcon = new Icon({
    iconUrl: driverPopUp,
    iconSize: [34, 34],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30],
  });

  const liveLocIcon = L.divIcon({
    html: `
    <div class="relative flex items-center justify-center w-9 h-9">
      <!-- Outer pulse ring -->
      <span class="absolute w-7 h-7 rounded-full border-2 border-blue-500 animate-ping"></span>
      
      <!-- Static circle with inner dot -->
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24" height="24">
        <circle cx="24" cy="24" r="20" fill="white" stroke="#3b82f6" stroke-width="3"/>
        <circle cx="24" cy="24" r="10" fill="#3b82f6"/>
      </svg>
    </div>
  `,
    className: "",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });

  return (
    <MapContainer
      center={pickupCoords || defaultPosition}
      zoom={13}
      style={{ height: "100%", width: "100%", minHeight: "300px" }}
      className="rounded-2xl shadow-md "
      maxBoundsViscosity={1.0}
      minZoom={12} // don't let user zoom out too far
      maxZoom={18} // optional, keep zoom range realistic
      scrollWheelZoom={true} // you can toggle zooming
    >
      <TileLayer
        url={`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=5f91c9c458154879844c3d0447834abf`}
        // url=''
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {pickupCoords &&
        Array.isArray(pickupCoords) &&
        pickupCoords.length === 2 && (
          <Marker position={pickupCoords}>
            <Popup>Pickup Location</Popup>
          </Marker>
        )}

      {dropOffCoords &&
        Array.isArray(dropOffCoords) &&
        dropOffCoords.length === 2 && (
          <Marker position={dropOffCoords}>
            <Popup>Drop-off Location</Popup>
          </Marker>
        )}

      {/* {driverLoc && Array.isArray(driverLoc) && driverLoc.length === 2 && (
        <Marker icon={driverIcon} position={driverLoc}>
          <Popup>Driver location</Popup>
        </Marker>
      )} */}

      {/* {availableDrivers &&
        availableDrivers.length > 0 &&
        availableDrivers.map(
          (driver, index) =>
            Array.isArray(driver.coordinates) &&
            driver.coordinates.length === 2 && (
              <Marker
                key={index}
                icon={driverIcon}
                position={driver.coordinates}
              >
                <Popup>{driver.name}</Popup>
              </Marker>
            )
        )} */}

      {routeCoords &&
        routeCoords.length > 0 &&
        routeCoords.every(
          (coord) => Array.isArray(coord) && coord.length === 2
        ) && (
          <>
            {isRideStarted && !driverRoute?.length && (
              <Marker icon={driverIcon} position={routeCoords[0]}>
                <Popup>Driver location</Popup>
              </Marker>
            )}
            <Polyline
              positions={routeCoords}
              color="rgba(20, 137, 255, 0.7)"
              weight={4}
            />
          </>
        )}

      {driverRoute &&
        driverRoute.length > 0 &&
        driverRoute.every(
          (coord) => Array.isArray(coord) && coord.length === 2
        ) && (
          <>
            {isRideStarted && (
              <Marker icon={driverIcon} position={driverRoute[0]}>
                <Popup>Driver location</Popup>
              </Marker>
            )}
            <Polyline positions={driverRoute} color="black" weight={4} />
          </>
        )}

      {currentLocation && (
        <Marker icon={liveLocIcon} position={currentLocation}>
          <Popup>Current location</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default MapComponent;
