import { AccountsInterface } from "../account/IAccount";
import { UsersInterface } from "../user/IUser";

export interface OrdersInterface {
  ID: number;
  CreatedAt: Date;
  User_ID: number;
  User: UsersInterface;
  Account_ID: number;
  Account: AccountsInterface;
  Slip: string;
  Slip_Create_At: Date;
  Is_Slip_Confirm: boolean;
  Is_Receive: boolean;
}
