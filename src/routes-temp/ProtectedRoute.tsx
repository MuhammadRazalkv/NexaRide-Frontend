import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const ProtectedRoute = () => {
  const { token } = useSelector((state: RootState) => state.auth);

  return token ? <Outlet /> : <Navigate to="/user/login" replace />;
};

export default ProtectedRoute;
