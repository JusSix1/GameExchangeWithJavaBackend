import { UsersInterface } from "../user/IUser";

export interface CommentsInterface {
    ID:					number,
    CreatedAt:          Date,
    Commenter_ID:       number,
    Commenter:          UsersInterface,
    Victim_ID:          number,
    Victim:             UsersInterface,
    Comment_Text:               String,
    Is_Positive:        boolean,
}