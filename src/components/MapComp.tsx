import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import { Icon } from "leaflet";
import { driverPopUp } from "@/assets";

interface MapComponentProps {
  pickupCoords?: [number, number] | null;
  dropOffCoords: [number, number] | null;
  routeCoords?: [number, number][];
  driverLoc?: [number, number];
  availableDrivers?: {
    name: string;
    coordinates: [number, number];
  }[];
  driverRoute?: [number, number][];
  isRideStarted?: boolean;
}

const MapComponent: React.FC<MapComponentProps> = ({
  pickupCoords,
  dropOffCoords,
  routeCoords,
  driverLoc,
  availableDrivers,
  driverRoute,
  isRideStarted = false,
}) => {
  const defaultPosition: [number, number] = [12.9716, 77.5946];
  const driverIcon = new Icon({
    iconUrl: driverPopUp,
    iconSize: [34, 34],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30],
  });

  return (
    <MapContainer
      center={pickupCoords || defaultPosition}
      zoom={13}
      style={{ height: "100%", width: "100%", minHeight: "300px" }}
      className="rounded-2xl shadow-md "
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

      {driverLoc && Array.isArray(driverLoc) && driverLoc.length === 2 && (
        <Marker icon={driverIcon} position={driverLoc}>
          <Popup>Driver location</Popup>
        </Marker>
      )}

      {availableDrivers &&
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
        )}

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
    </MapContainer>
  );
};

export default MapComponent;
