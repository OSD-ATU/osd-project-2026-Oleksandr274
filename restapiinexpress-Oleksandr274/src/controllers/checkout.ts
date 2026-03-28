import { Request, Response } from 'express';
import dotenv from "dotenv";
dotenv.config();
import { stripe } from '../models/stripe';
import { Item } from '../models/item';

const PORT = process.env.PORT || 3001;
const DOMAIN = `http://localhost:${PORT}`;

export const createCheckoutSession = async (req: Request, res: Response) => {
  const prices = await stripe.prices.list({
    lookup_keys: [req.body.lookup_key],
    expand: ['data.product'],
  });
  try {
    const items = req.body.items as Item[]

    const session = await stripe.checkout.sessions.create({
      line_items: items.map((item: Item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.productId.toString(),
            // images: [item.productId]
          },
          unit_amount: 100 * 100, //cents
        },
        quantity: item.quantity
      })),
      mode: 'payment',
      success_url: `${DOMAIN}/success.html`,
      cancel_url: `${DOMAIN}/cancel.html`,

    });
    res.redirect(303, session.url!);
  }
  catch (error) {
    console.log(error);
  }

}


