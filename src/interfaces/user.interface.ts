export interface IUser {
  _id: string;
  name: string;
  email: string;
  isBlocked: boolean;
  softBlock: boolean;
}
