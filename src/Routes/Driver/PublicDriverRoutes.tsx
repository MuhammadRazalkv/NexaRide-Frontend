import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect, useRef } from "react";

const DriverPublicRoute = () => {
  const { token } = useSelector((state: RootState) => state.driverAuth);
  const navigate = useNavigate();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (token && !hasRedirected.current) {
      hasRedirected.current = true;
      navigate("/driver/ride");
    }
  }, [token, navigate]);

  return <Outlet />;
};

export default DriverPublicRoute;
