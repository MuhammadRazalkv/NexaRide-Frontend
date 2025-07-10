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
import { IRideReqInfo } from "@/pages/driver/ride/DRide";
import { RideInfo } from "@/utils/socket";
interface RideCancelModalProps {
  isCancelOpen: boolean;
  setIsCancelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  rideInfo?: RideInfo | IRideReqInfo;
  cancelTheRide: () => void;
}

const RideCancelModal: React.FC<RideCancelModalProps> = ({
  isCancelOpen,
  cancelTheRide,
  rideInfo,
  setIsCancelOpen,
}) => {
  return (
    <>
      <AlertDialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
        {rideInfo && (
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Ride Confirmation</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel this ride? This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Ride</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 text-white hover:bg-red-600 transition"
                onClick={cancelTheRide}
              >
                Yes, Cancel Ride
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        )}
      </AlertDialog>
    </>
  );
};

export default RideCancelModal;
