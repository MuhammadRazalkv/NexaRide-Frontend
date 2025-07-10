import AdminNavBar from "@/components/admin/AdminNavbar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
// import { IComplaintInfo } from "@/interfaces/complaint.interface";
import { useEffect, useState } from "react";
import { Pagination, message } from "antd";
import {
  getComplaintInDetail,
  getComplaints,
  sendWarningEmail,
  updateComplaintStatus,
} from "@/api/auth/admin";
import { CarTaxiFront, Loader, Loader2, UserRound } from "lucide-react";
import { IRideHistoryItem } from "@/interfaces/fullRideInfo.interface";
import { IComplaintInfo } from "@/interfaces/complaint.interface";
import { formatTime } from "@/utils/DateAndTimeFormatter";

interface IComplaintInfoWithUserAndDriver {
  _id: string;
  rideId: string;
  filedById: string;
  filedByRole: string;
  complaintReason: string;
  description?: string;
  status: string;
  createdAt: Date;
  user: string;
  driver: string;
}

const AdminComplaints = () => {
  const [complaints, setComplaints] =
    useState<IComplaintInfoWithUserAndDriver[]>();
  const [messageApi, contextHolder] = message.useMessage();
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [complaint, setComplaintInDetail] = useState<IComplaintInfo>();
  const [rideInfo, setRideInfo] = useState<IRideHistoryItem>();
  const [isEmailSend, setIsEmailSend] = useState(false);
  const [filter, setFilter] = useState("");
  useEffect(() => {
    const fetchComplains = async () => {
      setLoading(true);
      try {
        const res = await getComplaints(currentPage, filter);
        if (res.success && res.complaints && res.total) {
          setLoading(false);
          setComplaints(res.complaints);
          setTotal(res.total);
        } else {
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);

        if (error instanceof Error) messageApi.error(error.message);
        else messageApi.error("Failed to fetch complaints");
      }
    };
    fetchComplains();
  }, [messageApi, currentPage, filter]);

  const fetchComplaintInDetail = async (id: string) => {
    setFetchingData(true);
    try {
      const res = await getComplaintInDetail(id);
      if (res.complaint && res.rideInfo) {
        setFetchingData(false);
        setComplaintInDetail(res.complaint);
        setRideInfo(res.rideInfo);
      }
    } catch (error) {
      setFetchingData(false);
      if (error instanceof Error) messageApi.error(error.message);
      else messageApi.error("Failed to fetch data ");
    }
  };

  const changeComplaintStatus = async (
    complaintId: string,
    type: "resolved" | "rejected"
  ) => {
    try {
      const res = await updateComplaintStatus(complaintId, type);
      if (res.success && res.complaint) {
        console.log("res complaint ", res.complaint);
        messageApi.success("Complaint status has been successfully updated");
        setComplaintInDetail(res.complaint);
      }
    } catch (error) {
      if (error instanceof Error) messageApi.error(error.message);
      else messageApi.error("Failed to update status");
    }
  };

  const handleSendEmail = async (id: string) => {
    try {
      setIsEmailSend(true);
      const res = await sendWarningEmail(id);
      if (res.success) {
        setIsEmailSend(false);
        messageApi.success("Warning mail has been sent successfully");
        setComplaintInDetail((pre) => {
          if (pre) {
            return { ...pre, warningMailSend: true };
          }
        });
      }
    } catch (error) {
      setIsEmailSend(false);

      if (error instanceof Error) messageApi.error(error.message);
      else messageApi.error("Failed to send email");
    }
  };

  return (
    <div className="bg-[#0E1220] min-h-screen ">
      <AdminNavBar />
      {contextHolder}

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
                            <strong>Cancelled By :</strong>{" "}
                            {rideInfo.cancelledBy}
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
      <div>
        <div className="flex-1 flex items-center justify-center p-4 md:p-6 lg:p-8">
          <div className="w-full max-w-6xl mx-auto flex flex-col items-center space-y-4">
            {/* Filter moved above table with better styling */}
            <div className="w-full flex justify-end mb-4">
              <div className="flex items-center gap-3">
                <label htmlFor="filter" className="text-white font-medium">
                  Filter by
                </label>
                <select
                  id="filter"
                  className="bg-[#1E293B] text-white border border-gray-600 rounded-md px-4 py-1 outline-none"
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Table container */}
            <div className="bg-[#1A2036] rounded-lg shadow-lg border border-[#2C3347]/50 overflow-hidden w-full">
              <div className="overflow-x-auto">
                {loading && (
                  <div className="flex justify-center items-center h-64">
                    <Loader />
                  </div>
                )}
                <table className="min-w-full divide-y divide-[#2C3347]">
                  <thead className="bg-[#2e345c]">
                    <tr>
                      <th className="px-4 py-4 text-center text-xs font-medium text-white uppercase w-16">
                        Date
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-medium text-white uppercase w-16">
                        Complainant
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-medium text-white uppercase w-16">
                        Against
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-medium text-white uppercase w-16">
                        Reason
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaints && complaints.length > 0 ? (
                      complaints.map((complaint) => (
                        <tr
                          onClick={() => {
                            fetchComplaintInDetail(complaint._id);
                            setIsSheetOpen(true);
                          }}
                          key={complaint._id}
                          className="hover:bg-[#424b72] transition-colors"
                        >
                          <td className="px-4 py-4 text-center text-sm font-medium text-white">
                            {new Date(complaint.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-4 text-center text-sm font-medium text-white">
                            {complaint.filedByRole === "user" ? (
                              <div className="flex items-center justify-center gap-1">
                                <UserRound className="h-4 w-4" />
                                {complaint.user}
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-1">
                                <CarTaxiFront className="h-4 w-4" />
                                {complaint.driver}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-4 text-center text-sm font-medium text-white">
                            {complaint.filedByRole === "user" ? (
                              <div className="flex items-center justify-center gap-1">
                                <CarTaxiFront className="h-4 w-4" />
                                {complaint.driver}
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-1">
                                <UserRound className="h-4 w-4" />
                                {complaint.user}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-4 text-center text-sm font-medium text-white">
                            {complaint.complaintReason}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-8 text-center text-white text-base"
                        >
                          No complaints found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <Pagination
          current={currentPage}
          total={total}
          pageSize={5}
          align="center"
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default AdminComplaints;
