import { CartItem } from "./cartItem.interface";

export interface User {
    _id?: string;
    firstName: string;
    lastName: string;
    phonenumber: string;
    email: string;
    password: string;
    role: string;
    dob: Date;
    address: string;
    dateJoined?: Date;
    lastUpdated?: Date;
    cartData: CartItem[]; 
}
