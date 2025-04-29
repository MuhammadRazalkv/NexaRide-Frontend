export interface IComplaintInfo {
  _id:string
  rideId: string;
  filedById: string;
  filedByRole: "user" | "driver";
  complaintReason: string;
  description?: string;
  status: "pending" | "resolved" | "rejected"
  warningMailSend:boolean
}
