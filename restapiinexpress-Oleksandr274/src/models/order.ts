import { ObjectId } from "mongodb";
import { Item } from "./item";

export interface Order {
    _id?: ObjectId;
    items: Item[]; // list of items {productId, quantity}
    shippingAddress1: string;
    shippingAddress2: string;
    city: string;
    eircode: string;
    phone: string;
    status: string;
    totalPrice: Number;
    userId: ObjectId; //id of user
    dateOrdered: Date;
}


