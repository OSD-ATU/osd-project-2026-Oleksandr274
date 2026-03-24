import { CartItem } from "./cartItem.interface";

export interface Order {
    _id?: string;
    items: CartItem[]; // list of items {productId, quantity}
    shippingAddress1: string;
    shippingAddress2: string;
    city: string;
    eircode: string;
    phone: string;
    status?: string;
    totalPrice?: number;
    userId?: string; //id of user
    dateOrdered?: Date;

}
