import { AccountsInterface } from "../account/IAccount";

export interface PostsInterface {
    ID:					number,
    Account_ID:        	number,      
	Account:            AccountsInterface,        
	Description:   	    string,        
	Advertising_image:  string,   
    Price:              number,     
	Is_Reserve:         boolean,         
	Is_Sell:    	    boolean,                       
}