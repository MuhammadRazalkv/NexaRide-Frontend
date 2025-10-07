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

export interface IComplaintInfoWithUserAndDriver {
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
