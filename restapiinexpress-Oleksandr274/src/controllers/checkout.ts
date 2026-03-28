import { Request, Response } from 'express';
import dotenv from "dotenv";
dotenv.config();
import { stripe } from '../models/stripe';
import { Item } from '../models/item';

const PORT = process.env.PORT || 3001;
const DOMAIN = `http://localhost:${PORT}`;

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const items = req.body.items as Item[]

    const session = await stripe.checkout.sessions.create({
      line_items: items.map((item: Item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.productId.toString(),
            images: ['https://placehold.co/600x400/EEE/31343C']
          },
          unit_amount: 100 * 100, //cents
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




