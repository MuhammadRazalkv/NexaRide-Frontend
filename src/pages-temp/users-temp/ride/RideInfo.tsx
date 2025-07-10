import { getRideInfo, submitComplaint } from "@/api/auth/user";
import NavBar from "@/components/user/NavBar";
import { useEffect, useState } from "react";
import { message } from "antd";
import { useLocation } from "react-router-dom";
import { IComplaintInfo } from "@/interfaces/complaint.interface";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/edit-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import RideInfoTable from "@/components/RideInfoTable";
import { IRideHistoryItem } from "@/interfaces/fullRideInfo.interface";

const RideInfo = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const location = useLocation();
  const rideId = location.state;
  const [rideInfo, setRideInfo] = useState<IRideHistoryItem | null>(null);
  const [complaintInfo, setComplaintInfo] = useState<
    IComplaintInfo | undefined
  >(undefined);
  const [loading, setLoading] = useState(false);
  const [isDialogueOpen, setIsDialogueOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [reason, setReason] = useState("");

  const [error, setError] = useState("");
  useEffect(() => {
    const fetchRideInfo = async () => {
      setLoading(true);
      try {
        const res = await getRideInfo(rideId);
        if (res.ride) {
          setRideInfo(res.ride);
        }
        if (res.complaintInfo) {
          setComplaintInfo(res.complaintInfo);
        }
      } catch (error) {
        if (error instanceof Error) {
          messageApi.error(error.message);
        } else {
          messageApi.error("Failed to fetch ride details");
        }
      } finally {
        setLoading(false);
      }
    };

    if (rideId) {
      fetchRideInfo();
    } else {
      messageApi.error("Ride ID not found");
      setLoading(false);
    }
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

  const openDialogue = () => {
    setIsDialogueOpen(true);
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
    console.log(description.trim().length);

    try {
      const res = await submitComplaint(rideId, reason, "user", description);
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
      <NavBar />
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

                <option value="Rude or inappropriate driver behavior">
                  Rude or inappropriate driver behavior
                </option>
                <option value="Asked for extra money">
                  Asked for extra money
                </option>
                <option value="Unsafe or reckless driving">
                  Unsafe or reckless driving
                </option>
                <option value="Driver delayed or didn’t show up">
                  Driver delayed or didn’t show up
                </option>
                <option value="Vehicle was unclean or poorly maintained">
                  Vehicle was unclean or poorly maintained
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
        rideInfo={rideInfo}
        loading={loading}
        openDialogue={openDialogue}
        variant="user"
        complaintInfo={complaintInfo}
      />
    </div>
  );
};

export default RideInfo;
