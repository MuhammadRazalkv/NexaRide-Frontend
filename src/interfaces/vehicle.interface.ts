export default interface IVehicle {
  nameOfOwner: string;
  addressOfOwner: string;
  brand: string;
  vehicleModel: string;
  color: string;
  numberPlate: string;
  regDate: Date;
  expDate: Date;
  insuranceProvider: string;
  policyNumber: string;
  vehicleImages: {
    frontView: string;
    rearView: string;
    interiorView: string;
  };
  status?: string;
  rejectionReason?: string;
  verified: boolean;
  category?: string;
}
