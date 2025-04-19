import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const AProtectedRoute = () => {
  const { token } = useSelector((state: RootState) => state.adminAuth);

  return token ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default AProtectedRoute;
