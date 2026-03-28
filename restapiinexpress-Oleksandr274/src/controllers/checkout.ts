import { Request, Response } from 'express';
import dotenv from "dotenv";
dotenv.config();
import { stripe } from '../models/stripe';
import { Item } from '../models/item';
import { ObjectId } from 'mongodb';
import { collections } from '../database';
import { Product } from '../models/products';

const PORT = process.env.PORT || 3001;

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const items = req.body.items as Item[]
    let productsList: any[] = [];
    // find products from items list
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (ObjectId.isValid(item.productId)) {
        const product = (await collections.products?.findOne({ _id: new ObjectId(item.productId) })) as unknown as Product;

        if (product) {
          productsList.push(product);
        } else {
          res.status(400).send('Unable to create Checkout (product does not exist)');
          return;
        }
      } else {
        res.status(400).send('Unable to create Checkout (product does not exist)');
        return;
      }
    }

    console.log(productsList.find(p=>p._id == items[0].productId));

    const session = await stripe.checkout.sessions.create({
      line_items: items.map((item: Item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: productsList.find(p =>p._id == item.productId).title ,
            images: [productsList.find(p =>p._id == item.productId).images[0]]
          },
          unit_amount: productsList.find(p =>p._id == item.productId).price * 100, //cents
        },
        quantity: item.quantity
      })),
      mode: 'payment',
      success_url: "http://localhost:4200/payment-success",
      cancel_url: "http://localhost:4200/payment-cancel",

    });
    res.json({ url: session.url });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: "Checkout session failed" });
  }
}




