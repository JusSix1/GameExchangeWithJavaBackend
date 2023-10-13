import { GendersInterface } from "./IGender";

export interface UsersInterface {
  ID: number;
  Email: string;
  FirstName: string;
  LastName: string;
  Password: string;
  PersonalID: string;
  Address: string;
  Profile_Name: string;
  Profile_Picture: string;
  Birthday: Date;
  Phone_Number: string;
  Bank_Account: string;
  Gender_ID: number;
  Gender: GendersInterface;
  Facebook: string;
  Instagram: string;
  Line: string;
}
