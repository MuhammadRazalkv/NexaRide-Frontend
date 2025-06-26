import {
  getDriverInfo,
  getDriverRideAndRating,
  getVehicleInfoForDriver,
} from "@/api/auth/admin";
import AdminNavBar from "@/components/admin/AdminNavbar";
import ProfileBody from "@/components/admin/ProfileBody";
import ProfileHead from "@/components/admin/ProfileHead";
import VehicleInfo from "@/components/admin/VehicleInfo";
import IDriver from "@/interfaces/driver.interface";
import IVehicle from "@/interfaces/vehicle.interface";
import { message } from "antd";
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

const DriverDetails = () => {
  const [driver, setDriver] = useState<IDriver>();
  const location = useLocation();
  const driverId: string | null | undefined = location.state;
  const [ratings, setRatings] = useState<{
    avgRating: number;
    totalRatings: number;
  }>();
  const [totalRides, setTotalRides] = useState(0);
  const [isVehicleInfo, setIsVehicleInfo] = useState(false);
  const [vehicle, setVehicle] = useState<IVehicle>();

  useEffect(() => {
    const fetchInfo = async () => {
      if (isVehicleInfo || driver || !driverId) {
        return;
      }
      try {
        const res = await getDriverInfo(driverId);
        const data = await getDriverRideAndRating(driverId);
        if (res.success && res.driver) {
          const { address, ...rest } = res.driver;
          setDriver({
            ...rest,
            ...(address ?? {}),
          });
        }

        if (data.success && data.ratings) {
          setRatings(data.ratings);
        }
        if (data.totalRides) {
          setTotalRides(data.totalRides);
        }
      } catch (error) {
        if (error instanceof Error) message.error(error.message);
      }
    };
    fetchInfo();
  }, [driverId, isVehicleInfo, driver]);
  useEffect(() => {
    if (vehicle || !isVehicleInfo || !driverId) {
      return;
    }
    const fetchInfo = async () => {
      try {
        const res = await getVehicleInfoForDriver(driverId);
        if (res.success && res.vehicle) {
          console.log(res.vehicle);

          setVehicle(res.vehicle);
        }
      } catch (error) {
        if (error instanceof Error) message.error(error.message);
      }
    };
    fetchInfo();
  }, [isVehicleInfo, driverId, vehicle]);
  return (
    <div className="bg-[#0E1220] min-h-screen flex flex-col items-center p-9">
      <AdminNavBar />
      {driverId ? (
        <>
          <ProfileHead
            name={driver?.name}
            profilePic={driver?.profilePic}
            ratings={ratings}
            totalRides={totalRides}
            variant="driver"
            isVehicleInfo={isVehicleInfo}
            setIsVehicleInfo={setIsVehicleInfo}
          />
          {isVehicleInfo ? (
            <VehicleInfo data={vehicle} />
          ) : (
            <ProfileBody info={driver} variant="driver" />
          )}
        </>
      ) : (
        <>
          <div className="min-h-[50vh] flex flex-col items-center justify-center text-center text-white space-y-4">
            <h1 className="text-2xl font-semibold text-red-400">
              No Driver ID found
            </h1>
            <p className="text-gray-300">Please go back to the driver list.</p>
            <Link
              to="/admin/drivers"
              className="px-5 py-2 bg-blue-600 rounded hover:bg-blue-700 transition duration-300 text-white font-medium"
            >
              Go Back
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default DriverDetails;
