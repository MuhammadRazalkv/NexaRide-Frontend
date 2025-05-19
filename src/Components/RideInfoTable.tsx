import { formatDate, formatTime } from "@/utils/DateAndTimeFormatter";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import { IRideHistoryItem } from "@/interfaces/fullRideInfo.interface";
import { IComplaintInfo } from "@/interfaces/complaint.interface";

interface RideInfoTableProps {
  rideInfo: IRideHistoryItem | null;
  variant: "user" | "driver";
  complaintInfo?: IComplaintInfo;
  loading: boolean;
  openDialogue: () => void;
}

const RideInfoTable: React.FC<RideInfoTableProps> = ({
  rideInfo,
  variant,
  loading,
  complaintInfo,
  openDialogue,
}) => {
  const navigate = useNavigate();
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "ongoing":
        return "text-blue-600";
      case "canceled":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getRideDate = () => {
    if (!rideInfo) return null;

    const timestamp = rideInfo.startedAt || rideInfo.cancelledAt;
    return timestamp ? formatDate(timestamp) : null;
  };
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : !rideInfo ? (
          <div className="text-center py-12 ">
            <h2 className="text-xl font-medium text-gray-900">
              No ride information found
            </h2>
            <p className="mt-2 text-gray-600">
              Please check the ride ID and try again
            </p>
            <button
              className="bg-black text-white text-sm p-3 rounded-lg mt-3"
              onClick={() => navigate(`/${variant.trim()}/history`)}
            >
              Go back to Ride history
            </button>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="px-4 py-5 sm:px-6 bg-black text-white">
              <h1 className="text-2xl font-bold">Ride Information</h1>
              <p className="mt-1 text-sm">Details about your trip</p>
            </div>

            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Driver | User , pickup , dropPff , ride status  */}
                <div className="space-y-6">
                  <div>
                    {variant == "user" ? (
                      <>
                        <h2 className="text-sm font-medium text-gray-500">
                          Driver
                        </h2>
                        <p className="mt-1 text-lg font-medium">
                          {rideInfo?.driverId?.name}
                        </p>
                      </>
                    ) : (
                      <>
                        <h2 className="text-sm font-medium text-gray-500">
                          User
                        </h2>
                        <p className="mt-1 text-lg font-medium">
                          {rideInfo?.userId?.name}
                        </p>
                      </>
                    )}
                  </div>

                  <div>
                    <h2 className="text-sm font-medium text-gray-500">
                      Pickup Location
                    </h2>
                    <p className="mt-1 text-base">{rideInfo.pickupLocation}</p>
                  </div>

                  <div>
                    <h2 className="text-sm font-medium text-gray-500">
                      Drop-off Location
                    </h2>
                    <p className="mt-1 text-base">{rideInfo.dropOffLocation}</p>
                  </div>

                  <div>
                    <h2 className="text-sm font-medium text-gray-500">
                      Ride Status
                    </h2>
                    <p
                      className={`mt-1 text-base font-medium capitalize ${getStatusColor(
                        rideInfo.status
                      )}`}
                    >
                      {rideInfo.status}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h2 className="text-sm font-medium text-gray-500">
                        Base Fare
                      </h2>
                      <p className="mt-1 text-lg font-semibold">
                        ₹ {rideInfo.baseFare.toFixed(2)}
                      </p>
                    </div>
                    {variant == "user" && (
                      <>
                        <div>
                          <h2 className="text-sm font-medium text-gray-500">
                            Premium Discount
                          </h2>
                          <p className="mt-1 text-lg font-semibold">
                            ₹ {rideInfo.premiumDiscount.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <h2 className="text-sm font-medium text-gray-500">
                            Offer Discount
                          </h2>
                          <p className="mt-1 text-lg font-semibold">
                            ₹ {rideInfo.offerDiscountAmount.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <h2 className="text-sm font-medium text-gray-500">
                            Total Fare
                          </h2>
                          <p className="mt-1 text-lg font-semibold">
                            ₹ {rideInfo.totalFare.toFixed(2)}
                          </p>
                        </div>
                      </>
                    )}

                    {variant == "driver" && (
                      <>
                        <div>
                          <h2 className="text-sm font-medium text-gray-500">
                            Your earnings
                          </h2>
                          <p className="mt-1 text-lg font-semibold">
                            ₹ {rideInfo?.driverEarnings?.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <h2 className="text-sm font-medium text-gray-500">
                            App fee
                          </h2>
                          {rideInfo.driverEarnings && (

                          <p className="mt-1 text-lg font-semibold">
                            ₹ {( rideInfo?.baseFare - rideInfo?.driverEarnings).toFixed(2)}
                          </p>
                          )}
                        </div>
                      </>
                    )}

                    <div>
                      <h2 className="text-sm font-medium text-gray-500">
                        Distance
                      </h2>
                      <p className="mt-1 text-base">
                        {(rideInfo.distance / 1000).toFixed(1)} km
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h2 className="text-sm font-medium text-gray-500">
                        Time
                      </h2>
                      <p className="mt-1 text-base">
                        {Math.round(rideInfo.estTime / 60)} mins
                      </p>
                    </div>

                    <div>
                      <h2 className="text-sm font-medium text-gray-500">
                        Payment Status
                      </h2>
                      <p
                        className={`mt-1 text-base font-medium capitalize ${getPaymentStatusColor(
                          rideInfo.paymentStatus
                        )}`}
                      >
                        {rideInfo.paymentStatus}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h2 className="text-sm font-medium text-gray-500">
                      Ride Timing
                    </h2>

                    {/* Display date at the top */}
                    {getRideDate() && (
                      <div className="mt-2 mb-3">
                        <span className="font-medium text-base">
                          {getRideDate()}
                        </span>
                      </div>
                    )}

                    <div className="space-y-2 text-sm">
                      {rideInfo.startedAt && (
                        <div className="flex items-center">
                          <span className="font-medium w-24">Started:</span>
                          <span>{formatTime(rideInfo.startedAt)}</span>
                        </div>
                      )}

                      {rideInfo.endedAt && (
                        <div className="flex items-center">
                          <span className="font-medium w-24">Ended:</span>
                          <span>{formatTime(rideInfo.endedAt)}</span>
                        </div>
                      )}

                      {rideInfo.cancelledBy && (
                        <div className="flex items-center">
                          <span className="font-medium w-24">
                            Cancelled by:
                          </span>
                          <span>{rideInfo.cancelledBy}</span>
                        </div>
                      )}
                      {rideInfo.cancelledAt && (
                        <div className="flex items-center">
                          <span className="font-medium w-24">
                            Cancelled at:
                          </span>
                          <span>{formatTime(rideInfo.cancelledAt)}</span>
                        </div>
                      )}

                      {!rideInfo.endedAt && !rideInfo.cancelledAt && (
                        <div className="mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          Ongoing Ride
                        </div>
                      )}
                    </div>
                    <div className="w-full mt-6">
                      {complaintInfo ? (
                        <div className="bg-white border border-neutral-200 p-4 rounded-xl shadow-sm">
                          <h4 className="text-lg font-semibold mb-2 text-neutral-800">
                            Complaint Information
                          </h4>
                          <p className="text-sm text-neutral-600 mb-1">
                            <span className="font-medium text-black">
                              Reason:
                            </span>{" "}
                            {complaintInfo.complaintReason}
                          </p>
                          {complaintInfo.description && (
                            <p className="text-sm text-neutral-600 mb-1">
                              <span className="font-medium text-black">
                                Description:
                              </span>{" "}
                              {complaintInfo.description}
                            </p>
                          )}
                          <p
                            className={`text-sm ${
                              complaintInfo.status === "resolved"
                                ? "text-green-500"
                                : complaintInfo.status === "rejected"
                                ? "text-red-500"
                                : "text-neutral-600"
                            }`}
                          >
                            <span className="font-medium text-black">
                              Status:
                            </span>{" "}
                            {complaintInfo.status}
                          </p>
                        </div>
                      ) : (
                        <button
                          className="bg-black text-white px-5 py-3 rounded-lg transition-transform hover:scale-105 duration-200"
                          onClick={openDialogue}
                        >
                          File a Complaint
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RideInfoTable;
