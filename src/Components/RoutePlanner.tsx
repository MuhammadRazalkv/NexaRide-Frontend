import  { useState } from 'react';
import axios from 'axios';


const RoutePlanner = () => {

  const [routeInfo, setRouteInfo] = useState<{ distance: number; estimatedTime: number } | null>(null);

  const calculateRoute = async () => {
    if (!pickup || !dropoff) return alert('Please select pickup and drop-off locations.');

    const response = await axios.post('http://localhost:3001/api/calculate-route', {
      pickup,
      dropoff,
    });

    setRouteInfo(response.data);
  };

  return (
    <div>
      <h2>Route Planner</h2>

      <button onClick={calculateRoute} className="bg-blue-500 text-white px-4 py-2 mt-4">
        Calculate Route
      </button>

      {routeInfo && (
        <div className="mt-4">
          <p>Distance: {routeInfo.distance} km</p>
          <p>Estimated Time: {routeInfo.estimatedTime} mins</p>
        </div>
      )}
    </div>
  );
};

export default RoutePlanner;
