import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";

const PublicRoute = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const driverToken = useSelector((state:RootState) => state.driverAuth.token)
  // If user is authenticated, redirect them to the Ride page
  if (token ) {
    return <Navigate to="/user/ride" replace />;
  }else if (driverToken) {
    return <Navigate to="/driver/ride" replace />;
    
  }

  // Allow access to public pages if user is not authenticated
  return <Outlet />;
};

export default PublicRoute;
