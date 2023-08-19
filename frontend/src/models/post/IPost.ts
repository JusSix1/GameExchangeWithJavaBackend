import { AccountsInterface } from "../account/IAccount";
import { UsersInterface } from "../user/IUser";

export interface PostsInterface {
    ID:					number,
	CreatedAt:  		Date,
	User_ID:			number,
	User:				UsersInterface,
    Account_ID:        	number,      
	Account:            AccountsInterface,        
	Description:   	    string,        
	Advertising_image:  string,    
	Is_Reserve:         boolean,         
	Is_Sell:    	    boolean,                       
}