import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";;
import { useEffect, useState } from "react";

const DriverProtectedRoute = () => {
  const { token } = useSelector((state: RootState) => state.driverAuth);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (token !== undefined) {
      setIsHydrated(true);
    }
  }, [token]);

  if (!isHydrated) return null; // Prevents unnecessary re-renders

  return token ? <Outlet /> : <Navigate to="/driver/login" replace />;
};

export default DriverProtectedRoute;




