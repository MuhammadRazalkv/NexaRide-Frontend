import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { IRideHistoryItem } from "@/interfaces/fullRideInfo.interface";
import { message } from "antd";
import { getRideInfo, submitComplaint } from "@/api/auth/driver";
import DNavBar from "@/components/driver/DNavBar";
import RideInfoTable from "@/components/RideInfoTable";
import { IComplaintInfo } from "@/interfaces/complaint.interface";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/edit-dialog";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
const DRideInfo = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const location = useLocation();
  const rideId = location.state;
  const [rideInfo, setRideInfo] = useState<IRideHistoryItem | null>(null);
  const [complaintInfo, setComplaintInfo] = useState<
    IComplaintInfo | undefined
  >(undefined);
  const [loading, setLoading] = useState(true);
  const [isDialogueOpen, setIsDialogueOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [reason, setReason] = useState("");

  const [error, setError] = useState("");
  const openDialogue = () => {
    setIsDialogueOpen(true);
  };
  useEffect(() => {
    const fetchRideInfo = async () => {
      setLoading(true);
      try {
        const res = await getRideInfo(rideId);
        console.log(
          'res ',res
        );
        
        if (res.ride) {
          setLoading(false);
          setRideInfo(res.ride);
        }
        if (res.complaintInfo) {
          setComplaintInfo(res.complaintInfo);
        }
      } catch (error) {
        if (error instanceof Error) messageApi.error(error.message);
        else messageApi.error("Failed to fetch ride info");
      }
    };
    fetchRideInfo();
  }, [rideId, messageApi]);

  const handleDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.trim();
    setDescription(value);
  };

  const handleSelection = (value: string) => {
    setError("");
    if (value == "other" && !description.trim()) {
      setError("Please describe your issue ");
    }
    setReason(value);
  };

  const handleSubmit = async () => {
    if (!reason) {
      setError("Please choose a reason");
      return;
    } else if (reason == "other" && description.trim().length < 10) {
      setError("Please provide more details about your issue.");
      return;
    }
    setError("");
    

    try {
      const res = await submitComplaint(rideId, reason, "driver", description);
      if (res.success && res.complaint) {
        messageApi.success("Complaint filed successfully");
        setIsDialogueOpen(false);
        setComplaintInfo(res.complaint);
      }
    } catch (error) {
      if (error instanceof Error) messageApi.error(error.message);
      else messageApi.error("Failed to submit complaint");
    }
  };

  return (
    <div>
      {contextHolder}
      <DNavBar />
      <Dialog open={isDialogueOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>File a complaint</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Please provide details about your complaint. Your feedback is
            important to us and will be reviewed for appropriate action{" "}
          </DialogDescription>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <div className="grid gap-6 py-6 px-4 bg-white rounded-xl shadow-md dark:bg-black dark:text-white max-w-md mx-auto">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="reason"
                className="text-right text-sm font-medium"
              >
                Reason
              </Label>
              <select
                id="reason"
                className="col-span-3 p-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                defaultValue={""}
                onChange={(e) => {
                  handleSelection(e.target.value);
                }}
              >
                <option value="" disabled>
                  Choose
                </option>
                Unsafe or inappropriate behavior
                <option value="Rude or inappropriate  behavior">
                  Rude or inappropriate behavior
                </option>
                <option value="Cancellations after arrival">
                  Cancellations after arrival
                </option>
                <option value="Payment disputes">Payment disputes</option>
                <option value="User didn’t show up">User didn’t show up</option>
                <option value="Passengers who damage the vehicle">
                  Passengers who damage the vehicle
                </option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label
                htmlFor="details"
                className="text-right text-sm font-medium pt-1"
              >
                Details
              </Label>
              <textarea
                id="details"
                rows={4}
                onChange={handleDescription}
                placeholder={`Describe your issue ${
                  reason !== "other" ? "(optional)" : ""
                }`}
                className="col-span-3 p-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => {
                if (isDialogueOpen) {
                  setIsDialogueOpen(false);
                }
                setError("");
                // setPhoneErr('')
              }}
              variant={"outline"}
            >
              Cancel{" "}
            </Button>
            <Button onClick={() => handleSubmit()}>Submit complaint</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <RideInfoTable
        loading={loading}
        openDialogue={openDialogue}
        rideInfo={rideInfo}
        variant="driver"
        complaintInfo={complaintInfo}
      />
    </div>
  );
};

export default DRideInfo;
