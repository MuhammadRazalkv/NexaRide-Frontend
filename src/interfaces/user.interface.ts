export interface IUser {
  _id: string;
  name: string;
  email: string;
  isBlocked: boolean;
  softBlock: boolean;
}
export interface IPremiumUsers {
  user:  string;
  amount: number;
  expiresAt: number;
  takenAt: number;
  type: string;
}
export interface IUserInfo {
  _id: string;
  name: string;
  email: string;
  phone: number;
  isBlocked: boolean;
  profilePic: string;
}