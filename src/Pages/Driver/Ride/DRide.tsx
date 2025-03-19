import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import { CiLogout } from "react-icons/ci";
import { logoutDriver } from "../../../Redux/slices/driverAuthSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStatus } from "../../../api/auth/driver";
import DNavBar from "@/components/DriverComp/DNavBar";

const DRide = () => {
  const driver = useSelector((state: RootState) => state.driverAuth.driver);
  const token = useSelector((state: RootState) => state.driverAuth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const hasFetched = useRef(false); // Prevents unnecessary re-fetching

  useEffect(() => {
    if (!token) {
      localStorage.clear();
      navigate("/driver/login");
      return;
    }

    let isMounted = true;

    const fetchStatus = async () => {
      try {
        const res = await getStatus();
        if (!isMounted) return;

        const { driverStatus, vehicleStatus } = res;

        if (driverStatus === "pending" || vehicleStatus === "pending") navigate("/driver/verification-pending");
        else if (driverStatus === "rejected") navigate("/driver/rejected");
        else if (vehicleStatus === "rejected") navigate("/driver/vehicle-rejected");
      } catch (error: unknown) {
        console.log("error from the getStatus ", error);
        localStorage.clear();
        navigate("/driver/login");
      }
    };

    fetchStatus();

    return () => {
      isMounted = false;
    };
  }, [token, navigate]);


  const handleLogout = () => {
    dispatch(logoutDriver());
  };

  return (
    <>
      <DNavBar />
      <div className="flex  items-center justify-center p-6 bg-gray-100 rounded-lg shadow-md">
        <h4 className="font-primary text-4xl mt-4 text-center text-gray-800">
          {driver ? driver.name : "No driver found"} <br />
          {driver && <span className="text-xl text-gray-600">{driver.email}</span>}
        </h4>
        <CiLogout onClick={handleLogout} />
      </div>
    </>

  );
};

export default DRide;
