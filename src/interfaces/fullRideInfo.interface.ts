export interface IRideHistoryItem {
  _id: string;
  pickupLocation: string;
  dropOffLocation: string;
  totalFare: number;
  distance: number;
  estTime: number;
  timeTaken?: number;
  status: "completed" | "cancelled" | "ongoing";
  startedAt?: number;
  endedAt?: number;
  cancelledAt?: number;
  cancelledBy?: string;
  paymentStatus: "completed" | "pending" | "failed" | "Not required";
  driverId?: {
    _id: string;
    name: string;
  };
  userId?: {
    _id: string;
    name: string;
  };
  driverEarnings?: number;
  commission?: number;
}
