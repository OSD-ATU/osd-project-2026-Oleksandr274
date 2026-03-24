import { Request, Response } from 'express';
import { collections } from '../database';

import { DeleteResult, ObjectId } from 'mongodb';
import { Order } from '../models/order';
import { User } from '../models/users';
import { Item } from '../models/item';
import { Product } from '../models/products';


export const getOrders = async (req: Request, res: Response) => {
  //get all orders from the database
  try {
    if (!collections.orders)
      return res.status(500).json({ error: 'orders collection not initialized' });

    const orders = (await collections.orders?.find({}).toArray()) as unknown as Order[];

    res.status(200).send(orders);
    return;

  }
  catch (error) {
    if (error instanceof Error) {
      console.log(`issue with receiving ${error.message}`);
    }
    else {
      console.log(`error with ${error}`)
    }
  }
  res.status(400).send(`Unable to receive orders`);
};


export const getOrderById = async (req: Request, res: Response) => {
  //get a single order by ID
  let id: string = req.params.id;

  const role: any = res.locals.payload.role
  let userId: any;

  /* if user is not admin -> userId is retrived from jwt payload 
  to prevent user from accessing other users' orders*/
  if (role !== 'admin') {
    userId = res.locals.payload.userId
  }

  try {
    let query: any;
    if(userId){
      query = { _id: new ObjectId(id), userId: userId };
    }else{
      query = { _id: new ObjectId(id) };
    }
    const order = (await collections.orders?.findOne(query)) as unknown as Order;

    if (order) {
      res.status(200).send(order);
      return;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(`error message ${error.message}`);
    }
    else {
      console.log(`error with ${error}`)
    }
  }
  res.status(400).send(`Unable to get the order`);
};

export const getUserOrders = async (req: Request, res: Response) => {
  const role: any = res.locals.payload.role
  let userId: any;

  /* if user is an admin -> userId must be provided in a query string
  otherwise it is retrived from jwt payload */
  if (role === 'admin') {
    userId = req.query.userId
  } else {
    userId = res.locals.payload.userId
  }

  //get user's orders from the database
  try {

    const user = (await collections.users?.findOne({ _id: new ObjectId(userId) })) as unknown as User;

    if (user) {
      if (!collections.orders)
        return res.status(500).json({ error: 'orders collection not initialized' });

      const orders = (await collections.orders?.find({ userId: userId }).toArray()) as unknown as Order[];

      res.status(200).send(orders);
      return;
    } else {
      res.status(404).json({ message: "user does not exist" });
      return;
    }
  }
  catch (error) {
    if (error instanceof Error) {
      console.log(`issue with receiving ${error.message}`);
    }
    else {
      console.log(`error with ${error}`)
    }
  }
  res.status(400).send(`Unable to receive orders`);
};

export const createOrder = async (req: Request, res: Response) => {
  // create a new order in the database
  const { shippingAddress1, shippingAddress2, city, eircode, phone } = req.body;

  const items = req.body.items as Item[]

  if (!items || items.length < 1) {
    res.status(400).send(`Unable to create new order (order items were not provided)`);
    return;
  }

  const userId = res.locals.payload.userId

  try {
    let orderTotalPrice: number = 0;
    let orderProducts: any[] = [];

    // find products from items list
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (ObjectId.isValid(item.productId)) {
        const product = (await collections.products?.findOne({ _id: new ObjectId(item.productId) })) as unknown as Product;

        if (product) {
          orderProducts.push(product);
        } else {
          res.status(400).send('Unable to create new order (product does not exist)');
          return;
        }
      }else{
        res.status(400).send('Unable to create new order (product does not exist)');
        return;
      }
    }

    console.log(orderProducts)

    // calculate order total price
    items.forEach(item => {
      const product = orderProducts.find(p => p._id == item.productId)

      orderTotalPrice += product!!.price * item.quantity
    });

    const newOrder: Order = {
      items: items,
      shippingAddress1: shippingAddress1,
      shippingAddress2: shippingAddress2,
      city: city,
      eircode: eircode,
      phone: phone,
      status: "placed",
      totalPrice: orderTotalPrice,
      userId: userId,
      dateOrdered: new Date()
    }

    const result = await collections.orders?.insertOne(newOrder)

    if (result) {
      const order = (await collections.orders?.findOne(result.insertedId)) as unknown as Order;
      res.status(201).location(`${result.insertedId}`).json(order);
    }
    else {
      res.status(500).send("Failed to create a new order.");
    }
    return;
  }
  catch (error) {
    if (error instanceof Error) {
      console.log(`issue with inserting ${error.message}`);
    }
    else {
      console.log(`error with ${error}`)
    }
  }
  res.status(400).send(`Unable to create new order`);
};


export const updateOrderStatus = async (req: Request, res: Response) => {
  //update order status in the database
  let id: string = req.params.id;

  const updatedOrder = {
    status: req.body.status
  }

  try {
    const result = await collections.orders?.updateOne({ "_id": new ObjectId(id) }, { $set: updatedOrder })

    if (result?.modifiedCount) {
      const order = (await collections.orders?.findOne(new ObjectId(id))) as unknown as Order;

      res.status(201).location(`${result.upsertedId}`).json(order)
    }
    else {
      res.status(500).send("Failed to update a new order.");
    }
    return;
  }
  catch (error) {
    if (error instanceof Error) {
      console.log(`issue with inserting ${error.message}`);
    }
    else {
      console.log(`error with ${error}`)
    }
  }
  res.status(400).send(`Unable to update new order`);
};

export const deleteOrder = async (req: Request, res: Response) => {
  // logic to delete order by ID from the database
  let id: string = req.params.id;

  try {
    //get the requested order
    const query = { _id: new ObjectId(id) };
    const order = (await collections.orders?.findOne(query)) as unknown as Order;

    if (order) {
      //delete the Order
      const deleteOrderResult = await collections.orders?.deleteOne({ "_id": new ObjectId(id) })
      if (deleteOrderResult?.deletedCount == 0)
        res.status(404).json({ message: `The requested Order ${req.params.id} was not found` });
      else
        res.status(200).json({ message: `delete order ${req.params.id} from the database` });
      return;
    }
    else {
      res.status(404).json({ message: `the requested ${req.params.id} order was not found` })
      return;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(`issue with deletion ${error.message}`);
    }
    else {
      console.log(`error with ${error}`)
    }
  }
  res.status(400).send(`Unable to delete the order`);
};



