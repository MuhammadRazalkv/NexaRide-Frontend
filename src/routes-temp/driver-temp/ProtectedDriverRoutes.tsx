import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { DRideProvider } from "@/context/driverSocketContext";
const DriverProtectedRoute = () => {
  const { token } = useSelector((state: RootState) => state.driverAuth);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (token !== undefined) {
      setIsHydrated(true);
    }
  }, [token]);

  if (!isHydrated) return null; // Prevents unnecessary re-renders

  return token ? (
    <DRideProvider>
      <Outlet />
    </DRideProvider>
  ) : (
    <Navigate to="/driver/login" replace />
  );
};

export default DriverProtectedRoute;
