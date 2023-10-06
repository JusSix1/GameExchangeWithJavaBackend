import { UsersInterface } from "../user/IUser";

export interface ReqSellersInterface {
  ID: number;
  CreatedAt: Date;
  User_ID: number;
  User: UsersInterface;
  Admin_ID: number;
  Personal_Card_Front: string;
  Personal_Card_Back: string;
  Is_Confirm: boolean;
  Note: string;
  Is_Reject: boolean;
}
