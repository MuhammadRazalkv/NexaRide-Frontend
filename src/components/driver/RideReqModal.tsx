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
import TimeProgressBar from "@/components/Timer";

import { IRideReqInfo } from "@/interfaces/ride.interface";
interface RideReqProps {
  rideReqInfo: IRideReqInfo;
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  rejectRide: (userId: string) => Promise<void>;
  acceptRide: (
    userId: string,
    pickupLocation: string,
    dropOffLocation: string,
    distance: number,
    time: number,
    fare: number,
    pickupCoords: [number, number],
    dropOffCoords: [number, number]
  ) => Promise<void>;
}
const RideReqModal: React.FC<RideReqProps> = ({
  isDialogOpen,
  rideReqInfo,
  setIsDialogOpen,
  acceptRide,
  rejectRide,
}) => {
  return (
    <>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {rideReqInfo && (
          <AlertDialogContent className="bg-white">
            <TimeProgressBar duration={15} />
            <AlertDialogHeader>
              <AlertDialogTitle className="text-black">
                New ride request from {rideReqInfo.user.name}
              </AlertDialogTitle>
              <AlertDialogDescription></AlertDialogDescription>
              <div className="text-gray-700 space-y-1">
                <div>
                  <span className="font-bold">From:</span>{" "}
                  {rideReqInfo.pickupLocation}
                </div>
                <div>
                  <span className="font-bold">To:</span>{" "}
                  {rideReqInfo.dropOffLocation}
                </div>
                <div>
                  <span className="font-bold">Est Distance:</span>{" "}
                  {rideReqInfo.distance
                    ? (rideReqInfo.distance / 1000).toFixed(2) + " km"
                    : "N/A"}
                </div>
                <div>
                  <span className="font-bold">Est Time:</span>{" "}
                  {rideReqInfo.time
                    ? Math.ceil(rideReqInfo.time / 60) + " min"
                    : "N/A"}
                </div>
                <div>
                  <span className="font-bold">Est Fare:</span> ₹
                  {rideReqInfo.fare}
                </div>
              </div>
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
    </>
  );
};

export default RideReqModal;
