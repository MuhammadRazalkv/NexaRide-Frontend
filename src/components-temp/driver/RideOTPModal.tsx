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
import { useState } from "react";

const RideOTPModal = ({
  handleOTPSubmit,
  setOTPError,
  OTPError,
}: {
  handleOTPSubmit: (OTP: string | null) => Promise<void>;
  setOTPError: (value: React.SetStateAction<string>) => void;
  OTPError: string;
}) => {
  const [OTP, setOTP] = useState<string | null>(null);
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
  return (
    <>
      <Dialog open>
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
            <Button
              disabled={OTPError.length > 0 || !OTP}
              onClick={() => handleOTPSubmit(OTP)}
            >
              Verify OTP
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RideOTPModal;
