// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import '@geoapify/geocoder-autocomplete/styles/minimal.css';
// import { GeocoderAutocomplete } from '@geoapify/geocoder-autocomplete';
// import { useEffect, useRef, useState } from 'react';

// function MapComponent() {
//     const mapRef = useRef(null);
//     const autocompleteRef = useRef<HTMLDivElement>(null); // Reference for the autocomplete element
//     const [position, setPosition] = useState<[number, number]>([12.9716, 77.5946]);

//     useEffect(() => {
//         if (!autocompleteRef.current) return;

//         const autocomplete = new GeocoderAutocomplete(autocompleteRef.current, '5f91c9c458154879844c3d0447834abf', {
//             placeholder: 'Enter a location',
//             type: 'city', // Limits search to cities
//         });

//         // Handle selection
//         autocomplete.on('select', (location) => {
//             if (location && location.properties) {
//                 const { lat, lon } = location.properties;
//                 setPosition([lat, lon]);

//                 // Optional: Fly to new position
//                 const map = mapRef.current;
//                 if (map) {
//                     map.setView([lat, lon], 14);
//                 }
//             }
//         });

//         // Clean up
//         return () => autocomplete.close();
//     }, []);
//     return (
//         <div style={{ display: 'flex', height: '100vh' }}>
//             {/* Autocomplete Input */}
//             <div style={{ width: '30%', padding: '10px' }}>
//                 <h3>Search Location</h3>
//                 <div ref={autocompleteRef}></div> {/* Autocomplete container */}
//             </div>

//             {/* Map Container */}
//             <div style={{ width: '70%' }}>
//                 <MapContainer
//                     ref={mapRef}
//                     center={position}
//                     zoom={12}
//                     style={{ height: '100%', width: '100%' }}
//                 >
//                     <TileLayer
//                         url={`https://maps.geoapify.com/v1/tile/positron/{z}/{x}/{y}.png?apiKey=5f91c9c458154879844c3d0447834abf`}
//                         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                     />
//                     <Marker position={position}>
//                         <Popup>Selected Location</Popup>
//                     </Marker>
//                 </MapContainer>
//             </div>
//         </div>
//     );
// }

// export default MapComponent;


import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
interface MapComponentProps {
  pickupCoords: [number, number] | null;
  dropOffCoords: [number, number] | null;
  routeCoords: [number, number][];  
}

const MapComponent: React.FC<MapComponentProps> = ({ pickupCoords, dropOffCoords, routeCoords }) => {
  const defaultPosition: [number, number] = [12.9716, 77.5946];
  
  return (
    
    <MapContainer
      center={pickupCoords || defaultPosition}
      zoom={13}
      style={{ height: "100%", width: "100%", minHeight: "300px" }} 
      className="rounded-2xl shadow-md"
    >
      <TileLayer
        // url={`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=5f91c9c458154879844c3d0447834abf`}
        url=''
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
      {routeCoords?.length > 0 && (
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

