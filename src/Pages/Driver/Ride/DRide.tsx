import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchCurrentStoredLocation,
  getStatus,
  updateIsAvailable,
  updateRandomLoc,
  verifyRideOTP,
} from "../../../api/auth/driver";
import DNavBar from "@/components/DriverComp/DNavBar";
import ToggleSwitch from "@/components/DriverComp/ToggleSwitch";
import { message } from "antd";
import MapComponent from "@/components/MapComp";
import {
  disconnectSocket,
  connectSocket,
  socket,
  ServerToClientEvents,
} from "@/utils/socket";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  fetchRoute,
  getLocationFromCoords,
  getRouteDetails,
} from "@/utils/geoApify";
import TimeProgressBar from "@/components/Timer";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/edit-dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface IRideReqInfo {
  user: { id: string; name: string };
  pickupCoords: [number, number];
  dropOffCoords: [number, number];
  pickupLocation: string;
  dropOffLocation: string;
  time?: number;
  distance?: number;
  fare: number;
}
type NewRideReqData = Parameters<ServerToClientEvents["new-ride-req"]>[0];

interface DriverRoute {
  formattedRoute: [number, number][];
  time: number;
  distance: number;
  reachBy: Date;
}
const DRide = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [currentLoc, setCurrentLoc] = useState<[number, number] | undefined>(
    undefined
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rideReqInfo, setRideReqInfo] = useState<IRideReqInfo | null>(null);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const [pickupCoords, setPickupCoords] = useState<[number, number] | null>(
    null
  );
  const [dropOffCoords, setDropOffCoords] = useState<[number, number] | null>(
    null
  );
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  // const [driverArrived, setDriverArrived] = useState(false);
  const [driverRoute, setDriverRoute] = useState<DriverRoute | undefined>(
    undefined
  );
  const [remainingRoute, setRemainingRoute] = useState<[number, number][]>([]);
  const [isRideStarted, setIsRideStarted] = useState(false);

  const [rejected, setRejected] = useState(false);
  const rejectedRef = useRef(false); // Track latest rejected state
  const rideReqRef = useRef<IRideReqInfo | null>(null);
  const [accepted, setAccepted] = useState(false);
  const acceptedRef = useRef(false);
  //! Connect socket io
  const token = useSelector((state: RootState) => state.driverAuth.token);
  const [otpDialog, setOtpDialog] = useState(false);
  const [OTP, setOTP] = useState<string | null>(null);
  const [OTPError, setOTPError] = useState("");
  // sync the value of rejected when it changes
  useEffect(() => {
    rejectedRef.current = rejected;
  }, [rejected]);

  useEffect(() => {
    acceptedRef.current = accepted;
  }, [accepted]);

  // Use effect for handling new req and socket connection
  useEffect(() => {
    if (!token) {
      messageApi.error("Token missing. Please ensure you are logged in.");
      return;
    }

    if (!socket.connected) {
      connectSocket(token, "driver");
    }

    // Handling new ride requests
    const handleNewRideReq = async (data: NewRideReqData) => {
      try {
        setRejected(false);
        const [pickupLocation, dropOffLocation, timeAndDistance] =
          await Promise.all([
            getLocationFromCoords(data.pickupCoords),
            getLocationFromCoords(data.dropOffCoords),
            getRouteDetails(data.pickupCoords, data.dropOffCoords),
          ]);

        const updatedRideReqInfo = {
          ...data,
          pickupLocation,
          dropOffLocation,
          ...timeAndDistance,
        };

        setRideReqInfo(updatedRideReqInfo);
        rideReqRef.current = updatedRideReqInfo;
        setIsDialogOpen(true);

        const timeout = setTimeout(() => {
          if (
            rideReqRef.current?.user &&
            !rejectedRef.current &&
            !acceptedRef.current
          ) {
            socket.emit("no-response", rideReqRef.current?.user.id);
            console.log("This timeout in handle new req is working");

            setRideReqInfo(null);
            setIsDialogOpen(false);
          }
        }, 30000);

        return () => clearTimeout(timeout);
      } catch (error) {
        console.error("Error fetching ride details:", error);
        messageApi.error("Failed to fetch ride details.");
      }
    };

    socket.on("new-ride-req", handleNewRideReq);

    return () => {
      socket.off("new-ride-req", handleNewRideReq);
      setIsDialogOpen(false);
      disconnectSocket();
    };
  }, [token, messageApi]);

  // To Fetch driver info and redirect
  useEffect(() => {
    let isMounted = true;

    const fetchStatus = async () => {
      try {
        const res = await getStatus();
        if (!isMounted) return;

        const { driverStatus, vehicleStatus, available } = res;

        // Correctly set availability state based on fetched data
        const availability = available !== "offline";
        setIsAvailable(availability); // Directly assign true/false

        if (driverStatus === "pending" || vehicleStatus === "pending")
          navigate("/driver/verification-pending");
        else if (driverStatus === "rejected") navigate("/driver/rejected");
        else if (vehicleStatus === "rejected")
          navigate("/driver/vehicle-rejected");
      } catch (error: unknown) {
        console.log("error from getStatus", error);
        localStorage.clear();
        navigate("/driver/login");
      }
    };

    fetchStatus();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  // To Change availability
  const handleAvailabilityChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newAvailability = e.target.checked;
    setIsAvailable(newAvailability);

    try {
      const res = await updateIsAvailable();

      if (!res.success) {
        setIsAvailable(!newAvailability);
        messageApi.error("Failed to change availability");
      }
    } catch (error) {
      setIsAvailable(!newAvailability); // Revert on error
      messageApi.error("Failed to change availability");
      console.error(error);
    }
  };

  const simulatedLiveTrackingToPickUp = useCallback(
    (driverRoute: DriverRoute) => {
      let currentIndex = 0;
      setCurrentLoc(undefined);

      const interval = setInterval(() => {
        if (currentIndex < driverRoute.formattedRoute.length) {
          const currentLocation = driverRoute.formattedRoute[currentIndex];

          socket.emit("driver-location-update", { location: currentLocation });
          // setCurrentLoc(currentLocation);

          // Update the remaining route only after ride starts
          setRemainingRoute((prevRoute) => prevRoute.slice(1));

          currentIndex++;
        } else {
          clearInterval(interval);
          messageApi.success("Driver has reached the pickup location.");
          socket.emit("driver-reached");
          setOtpDialog(true);
          socket.off("driver-location-update");
        }
      }, 3000);

      return () => clearInterval(interval);
    },
    [messageApi]
  );

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toString().trim();
    setOTPError("");
    if (!value) {
      return;
    } else if (value.length < 4 || value.length > 4) {
      setOTPError("Invalid OTP. Please enter a 4-digit code.");
    } else {
      setOTPError("");
      setOTP(value);
    }
  };

  const handleOTPSubmit = async () => {
    if (OTPError || !OTP) {
      return;
    }
    try {
      const response = await verifyRideOTP(OTP);
      if (response.success) {
        console.log("Otp verification complete");
        setOTPError("");
        setOtpDialog(false);
        
      } else {
        setOTPError("Wrong OTP");
      }
    } catch (error) {
      if (error instanceof Error) {
        setOTPError(error.message);
      } else {
        setOTPError("Unexpected error occurred ");
      }
    }
  };
  
  useEffect(() => {
    if (driverRoute && !isRideStarted) {
      setRemainingRoute(driverRoute.formattedRoute);
    } else if (driverRoute && isRideStarted) {
      setRemainingRoute(driverRoute.formattedRoute);
      simulatedLiveTrackingToPickUp(driverRoute);
    }
  }, [driverRoute, isRideStarted, simulatedLiveTrackingToPickUp]);

  // To update to a new Random location
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

  // Accept the ride
  const acceptRide = async (
    userId: string,
    pickupLocation: string,
    dropOffLocation: string,
    distance: number,
    time: number,
    fare: number,
    pickupCoords: [number, number],
    dropOffCoords: [number, number]
  ) => {
    if (!token) {
      messageApi.error("Token missing. Please ensure you are logged in.");
      return;
    }
    setAccepted(true);

    socket.emit("driver-ride-accepted", {
      token,
      userId,
      pickupLocation,
      dropOffLocation,
      distance,
      time,
      fare,
      pickupCoords,
      dropOffCoords,
    });

    setPickupCoords(pickupCoords);
    setDropOffCoords(dropOffCoords);
    const location = await fetchCurrentStoredLocation();
    if (location.success && location.location) {
      setCurrentLoc(location.coordinates);
      const driverRouteInfo = await fetchRoute(location.location, pickupCoords);
      if (driverRouteInfo) {
        const reachBy = new Date(Date.now() + driverRouteInfo?.time * 1000);
        setDriverRoute({ ...driverRouteInfo, reachBy });
      } else {
        messageApi.error("Failed to calculate driver route");
      }
      pickupCoords = [pickupCoords[1], pickupCoords[0]];
      const routeCoords = await fetchRoute(pickupCoords, dropOffCoords);
      if (routeCoords && routeCoords.formattedRoute) {
        setRouteCoords(routeCoords.formattedRoute);
      } else {
        messageApi.error("Failed to calculate route");
      }
      setIsRideStarted(true);
    }

    // if (driverRoute) {

    //   simulatedLiveTrackingToPickUp(driverRoute);
    // }
  };

  // Reject the ride
  const rejectRide = async (userId: string) => {
    try {
      setRejected(true);
      setRideReqInfo(null);
      socket.emit("reject-ride", userId);
    } catch (error) {
      console.log(error);
      messageApi.error("Failed to reject ride ");
    }
  };

  return (
    <>
      <DNavBar />
      {contextHolder}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {rideReqInfo && (
          <AlertDialogContent className="bg-white">
            <TimeProgressBar duration={30} />
            <AlertDialogHeader>
              <AlertDialogTitle className="text-black">
                New ride request from {rideReqInfo.user.name}
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-2">
                <p>
                  <span className="font-bold">From:</span>{" "}
                  {rideReqInfo.pickupLocation}
                </p>
                <p>
                  <span className="font-bold">To:</span>{" "}
                  {rideReqInfo.dropOffLocation}
                </p>
                <p>
                  <span className="font-bold">Est Distance:</span>{" "}
                  {rideReqInfo.distance
                    ? (rideReqInfo.distance / 1000).toFixed(2) + " km"
                    : "N/A"}
                </p>
                <p>
                  <span className="font-bold">Est Time:</span>{" "}
                  {rideReqInfo.time
                    ? Math.ceil(rideReqInfo.time / 60) + " min"
                    : "N/A"}
                </p>
                <p>
                  <span className="font-bold">Est Fare:</span> ₹
                  {rideReqInfo.fare}
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                className="bg-red-500 hover:bg-red-700 hover:text-white text-white"
                onClick={() => rejectRide(rideReqInfo.user.id)}
              >
                Reject
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-green-500 hover:bg-green-700"
                onClick={() =>
                  acceptRide(
                    rideReqInfo.user.id,
                    rideReqInfo.pickupLocation,
                    rideReqInfo.dropOffLocation,
                    rideReqInfo.distance || 0,
                    rideReqInfo.time || 0,
                    rideReqInfo.fare,
                    rideReqInfo.pickupCoords,
                    rideReqInfo.dropOffCoords
                  )
                }
              >
                Accept
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        )}
      </AlertDialog>

      <Dialog open={otpDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm OTP</DialogTitle>
            <DialogDescription>
              Confirm the otp from the user to start the ride.
            </DialogDescription>
          </DialogHeader>
          {OTPError && <p className="text-red-500 text-xs">{OTPError}</p>}

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                OTP
              </Label>
              <Input
                id="username"
                type="number"
                className="col-span-3"
                onChange={handleOTPChange}
              />
            </div>
          </div>
          <DialogFooter>
            {/* <Button
              onClick={() => {
                if (isDialogOpen) {
                  setIsDialogOpen(false);
                }
                setNameErr(null);
                setPhoneErr("");
              }}
              variant={"outline"}
            >
              Cancel{" "}
            </Button> */}
            <Button onClick={handleOTPSubmit}>Verify OTP</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] mt-6 mx-5 gap-5 md:min-h-[calc(80vh-90px)] lg:min-h-[calc(100vh-90px)] overflow-x-auto">
        {/* Left Section - Info Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-4">
          <div className="bg-white mt-4 p-4 rounded-xl shadow-md ">
            {!rideReqInfo && (
              <button
                onClick={handleLocationUpdate}
                className="bg-black text-white px-4 py-2 rounded-lg transition-transform duration-200 hover:scale-105 hover:bg-gray-800"
              >
                Assign Location
              </button>
            )}
            <div className="flex items-center gap-3">
              <p className="text-gray-700 font-medium">Ready to take rides</p>
              <ToggleSwitch
                isChecked={isAvailable}
                onChange={handleAvailabilityChange}
              />
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Ride Info</h2>
          <p className="text-gray-600">
            Details about your current status and rides.
          </p>
          {rideReqInfo && driverRoute && (
            <div className="mt-4 border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-500 mt-2">
                <span className="font-medium text-black">Reach by:</span>{" "}
                {driverRoute.reachBy.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              <p className="text-sm text-gray-500">
                <span className="font-medium text-black">
                  Distance to Pickup:
                </span>{" "}
                {(driverRoute.distance / 1000).toFixed(2)} km
              </p>
            </div>
          )}
        </div>

        <div className="w-full min-h-[400px] max-h-[80vh] z-0">
          <MapComponent
            pickupCoords={pickupCoords}
            dropOffCoords={dropOffCoords}
            routeCoords={routeCoords}
            driverLoc={currentLoc}
            isRideStarted={isRideStarted}
            driverRoute={
              isRideStarted ? remainingRoute : driverRoute?.formattedRoute
            }
          />
        </div>
      </div>
    </>
  );
};

export default DRide;
