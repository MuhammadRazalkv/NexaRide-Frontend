import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";

const PublicRoute = () => {
  const { token } = useSelector((state: RootState) => state.auth);

  // If user is authenticated, redirect them to the Ride page
  if (token ) {
    return <Navigate to="/user/ride" replace />;
  }

  // Allow access to public pages if user is not authenticated
  return <Outlet />;
};

export default PublicRoute;
