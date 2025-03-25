import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getStatus,
  updateIsAvailable,
  updateRandomLoc,
} from "../../../api/auth/driver";
import DNavBar from "@/components/DriverComp/DNavBar";
import ToggleSwitch from "@/components/DriverComp/ToggleSwitch";
import { message } from "antd";
import MapComponent from "@/components/MapComp";

const DRide = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [currentLoc, setCurrentLoc] = useState<[number, number] | undefined>(
    undefined
  );
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const key = "updatable";

  useEffect(() => {
    // if (!token) {
    //   localStorage.clear();
    //   navigate("/driver/login");
    //   return;
    // }

    let isMounted = true;

    const fetchStatus = async () => {
      try {
        const res = await getStatus();
        if (!isMounted) return;

        const { driverStatus, vehicleStatus, available } = res;
        setIsAvailable(available);
        if (driverStatus === "pending" || vehicleStatus === "pending")
          navigate("/driver/verification-pending");
        else if (driverStatus === "rejected") navigate("/driver/rejected");
        else if (vehicleStatus === "rejected")
          navigate("/driver/vehicle-rejected");
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
  }, [navigate]);

  const handleAvailabilityChange = async () => {
    setIsAvailable(!isAvailable);
    try {
      const res = await updateIsAvailable();
      if (res.success && res.availability) {
        setIsAvailable(res.availability);
      } else {
        messageApi.open({
          key,
          type: "error",
          content: "Failed to change availability",
        });
      }
    } catch (error) {
      console.log(error);
      messageApi.open({
        key,
        type: "error",
        content: "Failed to change availability",
      });
    }
  };

  useEffect(() => {
    if (currentLoc) {
      console.log("Updated currentLoc:", currentLoc); // Logs the updated value
    }
  }, [currentLoc]);

  const handleLocationUpdate = async () => {
    try {
      const res = await updateRandomLoc();
      if (res.success && res.coordinates) {
        messageApi.success("Updated a random location");
        console.log("current loc ", res.coordinates);
        setCurrentLoc([res.coordinates[1], res.coordinates[0]]);
      } else {
        messageApi.error("Failed to update a location");
      }
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        messageApi.error(error.message);
      } else {
        messageApi.error("Failed to update a location");
      }
    }
  };

  return (
    <>
      <DNavBar />
      {contextHolder}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] mt-6 mx-5 gap-5 md:min-h-[calc(80vh-90px)] lg:min-h-[calc(100vh-90px)] overflow-x-auto">
        {/* Left Section - Info Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-4">
          <div className="bg-white mt-4 p-4 rounded-xl shadow-md ">
            <button
              onClick={handleLocationUpdate}
              className="bg-black text-white px-4 py-2 rounded-lg transition-transform duration-200 hover:scale-105 hover:bg-gray-800"
            >
              Assign Location
            </button>

            <div className="flex items-center gap-3">
              <p className="text-gray-700 font-medium">Ready to take rides</p>
              <ToggleSwitch
                isChecked={isAvailable}
                onChange={handleAvailabilityChange}
              />
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Driver Info</h2>
          <p className="text-gray-600">
            Details about your current status and rides.
          </p>
        </div>

        <div className="w-full min-h-[400px] max-h-[80vh]">
          <MapComponent
            pickupCoords={null}
            dropOffCoords={null}
            driverLoc={currentLoc}
          />
        </div>
      </div>
    </>
  );
};

export default DRide;
