export interface IWallet {
  balance: number;
  transactions?: [
    {
      type: string;
      date: number;
      amount: number;
      rideId?: string;
    }
  ];
}
export interface UserWallet {
  balance: number;
  transactions?: [
    {
      type: string;
      date: number;
      amount: number;
    }
  ];
}
