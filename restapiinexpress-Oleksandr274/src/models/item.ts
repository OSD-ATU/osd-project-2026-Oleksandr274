import { ObjectId } from "mongodb";

export interface Item {
  productId : ObjectId;
  quantity: number
}
