export default   interface IDriver {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pin_code: string;
  dob: string;
  license_exp: string;
  profilePic: string;
  license_number: string;
}

export interface IPendingDriver {
  _id: string;
  name: string;
  email: string;
  phone: string;
  license_number: string;
  vehicle_id?: string;
  address: {
    street: string;
    city: string;
    state: string;
    pin_code: string;
  };
  dob: string;
  status: string;
  license_exp: string;
  vehicleDetails: {
    _id: string;
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
    status: string;
    category?: string;
    vehicleImages: {
      frontView: string;
      rearView: string;
      interiorView: string;
    };
  };
} 