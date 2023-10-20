import { UsersInterface } from "../user/IUser";

export interface ReqGamesInterface {
  ID: number;
  User_ID: number;
  User: UsersInterface;
  Name: string;
  Is_Add: boolean;
  Is_Reject: boolean; 
  Note: string;
}
