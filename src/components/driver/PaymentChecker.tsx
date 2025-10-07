import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/edit-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { TbMessage } from "react-icons/tb";
const PaymentChecker = () => {
    const checkPaymentStatus = async ()=>{
        const res = await 
    }
  return (
    <Dialog open>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm OTP</DialogTitle>
          <DialogDescription>
            Confirm the otp from the user to start the ride.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button onClick={() =>  className="flex-1">
            Verify OTP
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentChecker;
