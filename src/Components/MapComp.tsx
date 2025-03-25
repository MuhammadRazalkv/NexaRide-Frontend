import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import { Icon } from "leaflet";
import { PopUpDriver } from "@/Assets";
interface MapComponentProps {
  pickupCoords?: [number, number] | null;
  dropOffCoords: [number, number] | null;
  routeCoords?: [number, number][];
  driverLoc?: [number, number];
  availableDrivers?: {
    name: string;
    coordinates: [number, number];
  }[];
}

const MapComponent: React.FC<MapComponentProps> = ({
  pickupCoords,
  dropOffCoords,
  routeCoords,
  driverLoc,
  availableDrivers,
}) => {
  const defaultPosition: [number, number] = [12.9716, 77.5946];
  const driverIcon = new Icon({
    iconUrl: PopUpDriver,
    iconSize: [34, 34],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30],
  });

  return (
    <MapContainer
      center={pickupCoords || defaultPosition}
      zoom={13}
      style={{ height: "100%", width: "100%", minHeight: "300px" }}
      className="rounded-2xl shadow-md"
    >
      <TileLayer
        url={`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=5f91c9c458154879844c3d0447834abf`}
        // url=''
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {pickupCoords && (
        <Marker position={pickupCoords}>
          <Popup>Pickup Location</Popup>
        </Marker>
      )}
      {dropOffCoords && (
        <Marker position={dropOffCoords}>
          <Popup>Drop-off Location</Popup>
        </Marker>
      )}

      {driverLoc && (
        <Marker icon={driverIcon} position={driverLoc}>
          <Popup>Driver location</Popup>
        </Marker>
      )}

      {availableDrivers &&
        availableDrivers.length > 0 &&
        availableDrivers.map((driver, index) => (
          <Marker key={index} icon={driverIcon} position={driver.coordinates}>
            <Popup>{driver.name}</Popup>
          </Marker>
        ))}

      {routeCoords && routeCoords?.length > 0 && (
        <Polyline
          positions={routeCoords}
          color="rgba(20, 137, 255, 0.7)"
          weight={4}
        />
      )}
    </MapContainer>
  );
};

export default MapComponent;
