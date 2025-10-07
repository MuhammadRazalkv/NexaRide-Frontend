import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { IComplaintInfo } from "@/interfaces/complaint.interface";
import { IRideHistoryItem } from "@/interfaces/fullRideInfo.interface";
import { formatTime } from "@/utils/DateAndTimeFormatter";
import { Loader2 } from "lucide-react";
const ComplaintCard = ({
  isSheetOpen,
  setIsSheetOpen,
  complaint,
  fetchingData,
  rideInfo,
  isEmailSend,
  changeComplaintStatus,
  handleSendEmail,
}: {
  isSheetOpen: boolean;
  setIsSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  complaint?: IComplaintInfo;
  fetchingData: boolean;
  rideInfo?: IRideHistoryItem;
  isEmailSend: boolean;
  changeComplaintStatus: (
    complaintId: string,
    type: "resolved" | "rejected"
  ) => Promise<void>;
  handleSendEmail: (id: string) => Promise<void>;
}) => {
  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetContent className="bg-gray-900 border-0 h-full w-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-white">Complaint in detail</SheetTitle>
          {fetchingData && <Loader2 className="text-white  animate-spin" />}
          <SheetDescription> </SheetDescription>
          {!fetchingData && (
            <>
              <div className="text-white space-y-4 mt-4">
                {complaint && (
                  <div className="bg-gray-800 p-4 rounded-xl">
                    <h3 className="text-lg font-semibold mb-2">
                      Complaint Details
                    </h3>
                    <p>
                      <strong>Reason:</strong> {complaint.complaintReason}
                    </p>
                    <p>
                      <strong>Description:</strong>{" "}
                      {complaint.description || "N/A"}
                    </p>
                    <p>
                      <strong>Status:</strong> {complaint.status}
                    </p>
                    <p>
                      <strong>Filed By:</strong> {complaint.filedByRole}
                    </p>
                  </div>
                )}

                {rideInfo && (
                  <div className="bg-gray-800 p-4 rounded-xl">
                    <h3 className="text-lg font-semibold mb-2">
                      Ride Information
                    </h3>
                    <p>
                      <strong>Pickup:</strong> {rideInfo.pickupLocation}
                    </p>
                    <p>
                      <strong>Drop-off:</strong> {rideInfo.dropOffLocation}
                    </p>
                    <p>
                      <strong>Status:</strong> {rideInfo.status}
                    </p>
                    {rideInfo.startedAt && (
                      <p>
                        <strong>Started At:</strong>{" "}
                        {formatTime(rideInfo.startedAt)}
                      </p>
                    )}
                    {rideInfo.endedAt && (
                      <p>
                        <strong>Ended At :</strong>{" "}
                        {formatTime(rideInfo.endedAt)}
                      </p>
                    )}
                    {rideInfo.cancelledAt && rideInfo.cancelledBy && (
                      <>
                        <p>
                          <strong>Cancelled At :</strong>{" "}
                          {formatTime(rideInfo.cancelledAt)}
                        </p>
                        <p>
                          <strong>Cancelled By :</strong> {rideInfo.cancelledBy}
                        </p>
                      </>
                    )}
                    <p>
                      <strong>Original Fare:</strong> ₹{rideInfo.baseFare}
                    </p>
                    <p>
                      <strong>Total Fare:</strong> ₹{rideInfo.totalFare}
                    </p>
                    <p>
                      <strong>Driver Earnings:</strong> ₹
                      {rideInfo?.driverEarnings}
                    </p>
                    <p>
                      <strong>App Fee:</strong> ₹{rideInfo?.commission}
                    </p>
                    <p>
                      <strong>Distance:</strong>{" "}
                      {(rideInfo.distance / 1000).toFixed(2)} km
                    </p>
                    <p>
                      <strong>Time:</strong>{" "}
                      {(rideInfo.estTime / 60).toFixed(2)} min
                    </p>

                    {rideInfo.userId && (
                      <p>
                        <strong>User:</strong> {rideInfo.userId.name}
                      </p>
                    )}
                    {rideInfo.driverId && (
                      <p>
                        <strong>Driver:</strong> {rideInfo.driverId.name}
                      </p>
                    )}
                  </div>
                )}
              </div>
              {complaint && (
                <div className="bg-gray-800 p-4 rounded-xl shadow-md w-full max-w-md mx-auto">
                  {complaint?.status == "pending" ? (
                    <>
                      <h3 className="text-lg font-semibold mb-4 text-white text-center">
                        Actions
                      </h3>
                      <div className="flex flex-col gap-3">
                        <button
                          className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 transition-colors duration-200 text-white font-medium rounded-xl"
                          onClick={() =>
                            changeComplaintStatus(complaint._id, "resolved")
                          }
                        >
                          Resolve Complaint
                        </button>
                        {!complaint.warningMailSend && (
                          <button
                            className={`w-full  px-4 py-2 bg-orange-500 hover:bg-orange-600 transition-colors duration-200 text-white font-medium rounded-xl ${
                              isEmailSend && "cursor-not-allowed"
                            }`}
                            disabled={isEmailSend}
                            onClick={() => handleSendEmail(complaint._id)}
                          >
                            Send Warning Mail
                          </button>
                        )}
                        <button
                          className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 transition-colors duration-200 text-white font-medium rounded-xl"
                          onClick={() =>
                            changeComplaintStatus(complaint._id, "rejected")
                          }
                        >
                          Reject Complaint
                        </button>
                      </div>
                    </>
                  ) : (
                    <h3
                      className={`text-lg font-semibold mb-4 ${
                        complaint.status == "resolved"
                          ? "text-green-500"
                          : "text-red-500"
                      } text-center`}
                    >
                      The complaint has been {complaint.status}
                    </h3>
                  )}
                </div>
              )}
            </>
          )}
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default ComplaintCard;
