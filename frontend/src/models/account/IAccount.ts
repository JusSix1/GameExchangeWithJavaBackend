import { GamesInterface } from "./IGame";
import { UsersInterface } from "../user/IUser";
import { OrdersInterface } from "../order/IOrder";

export interface AccountsInterface {
    ID:					number,
    ID_Account:        	number,
	User_ID:           	number,         
	User:              	UsersInterface,        
	Game_Account:   	string,        
	Game_Password:  	string,        
	Email:             	string,         
	Email_Password:    	string,                       
	Game_ID: 			number,         
	Game:    			GamesInterface,
	Order_ID: 		   	number,
	Order: 			   	OrdersInterface,
	Is_Post:			boolean,
}