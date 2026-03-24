import { Request, Response } from 'express';
import { collections } from '../database';
import { createProductSchema, updateProductSchema, Product } from '../models/products'
import { ObjectId } from 'mongodb';
import { User } from '../models/users';

export const getUserCart = async (req: Request, res: Response) => {
  //get a user cart
  try {
    
    const userId = res.locals.payload.userId
    
    const userCart = (await collections.users?.findOne({ _id: new ObjectId(userId) },{ projection: { cartData: 1 } }));

    if(userCart){
      res.status(200).send(userCart);
      return;
    }

  } catch (error) {
    if (error instanceof Error) {
      console.log(`issue with retriving ${error.message}`);
    }
    else {
      console.log(`error with ${error}`)
    }
  }
  res.status(400).send(`Unable to get the cart`); //default response

}
export const addToCart = async (req: Request, res: Response) => {
  // add a product to user cart
  try {
    const productId: any = req.params.productId
    const userId = res.locals.payload.userId

    const user = (await collections.users?.findOne({ _id: new ObjectId(userId) })) as unknown as User;

    //check if user exists
    if (user) {
      const product = (await collections.products?.findOne({ _id: new ObjectId(productId) })) as unknown as Product;

      //check if product exists
      if (product) {
        let productInCart = user.cartData.findIndex(ci => ci.productId == productId)
        if (productInCart == -1) {
          user.cartData.push({ productId: productId, quantity: 1 })
        } else {
          user.cartData[productInCart].quantity += 1
        }

        const result = await collections.users?.updateOne({ "_id": new ObjectId(userId) }, { $set: user });

        if (result) {
          const userCart = (await collections.users?.findOne({ _id: new ObjectId(userId) },{ projection: { cartData: 1 } }));
          res.status(201).json(userCart);
          return;
        } else {
          res.status(500).send("Failed to add item to cart");
          return
        }
      } else {
        res.status(404).json({ message: "product does not exist" });
        return;
      }
    } else {
      res.status(404).json({ message: "user does not exist" });
      return;
    }

  } catch (error) {
    if (error instanceof Error) {
      console.log(`issue with receiving ${error.message}`);
    }
    else {
      console.log(`error with ${error}`)
    }
  }
  res.status(400).send(`Unable to add item to cart`); //default response
}
export const updateCart = async (req: Request, res: Response) => {
  // update product quantity in user cart
  try {
    const { userId, productId, quantity } = req.body

    const user = (await collections.users?.findOne({ _id: new ObjectId(userId) })) as unknown as User;

    //check if user exists
    if (user) {
      const product = (await collections.products?.findOne({ _id: new ObjectId(productId) })) as unknown as Product;

      //check if product exists
      if (product) {
        let productInCart = user.cartData.findIndex(ci => ci.productId == productId)
        if (productInCart == -1) {
          user.cartData.push({ productId: productId, quantity: quantity | 1 })
        } else {
          user.cartData[productInCart].quantity = quantity | 1
        }

        const result = await collections.users?.updateOne({ "_id": new ObjectId(userId) }, { $set: user });

        if (result) {
          const user = (await collections.users?.findOne(new ObjectId(userId))) as unknown as User;
          res.status(201).location(`${result.upsertedId}`).json(user);
          return;
        } else {
          res.status(500).send("Failed to update item quantity in cart");
          return
        }
      } else {
        res.status(404).json({ message: "product does not exist" });
        return;
      }
    } else {
      res.status(404).json({ message: "user does not exist" });
      return;
    }

  } catch (error) {
    if (error instanceof Error) {
      console.log(`issue with updating ${error.message}`);
    }
    else {
      console.log(`error with ${error}`)
    }
  }
  res.status(400).send(`Unable to update product quantity in cart`); //default response
}

export const removeItemFromCart = async (req: Request, res: Response) => {
  // delete a product from user cart
  try {
    const { userId, productId } = req.body

    const user = (await collections.users?.findOne({ _id: new ObjectId(userId) })) as unknown as User;

    //check if user exists
    if (user) {
      const product = (await collections.products?.findOne({ _id: new ObjectId(productId) })) as unknown as Product;

      //check if product exists
      if (product) {
        let productInCart = user.cartData.findIndex(ci => ci.productId == productId)
        if (productInCart != -1) {
          const filteredCart = user.cartData.filter( el => { 
            el.productId !== productId
          })

          user.cartData = filteredCart

        }

        const result = await collections.users?.updateOne({ "_id": new ObjectId(userId) }, { $set: user });

        if (result) {
          const user = (await collections.users?.findOne(new ObjectId(userId))) as unknown as User;
          res.status(201).location(`${result.upsertedId}`).json(user);
          return;
        } else {
          res.status(500).send("Failed to remove item from cart");
          return
        }
      } else {
        res.status(404).json({ message: "product does not exist" });
        return;
      }
    } else {
      res.status(404).json({ message: "user does not exist" });
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
  res.status(400).send(`Unable to remove item from cart`); //default response
}

export const emptyCart = async (req: Request, res: Response) => {
  // empty user cart
  try {
    const userId = res.locals.payload.userId
    
    const user = (await collections.users?.findOne({ _id: new ObjectId(userId) })) as unknown as User;

    //check if user exists
    if (user) {
      
      user.cartData = []

        const result = await collections.users?.updateOne({ "_id": new ObjectId(userId) }, { $set: user });

        if (result) {
          const userCart = (await collections.users?.findOne({ _id: new ObjectId(userId) },{ projection: { cartData: 1 } }));
          res.status(201).json(userCart);
          return;
        } else {
          res.status(500).send("Failed to empty user cart");
          return;
        }
    } else {
      res.status(404).json({ message: "user does not exist" });
      return;
    }

  } catch (error) {
    if (error instanceof Error) {
      console.log(`issue with receiving ${error.message}`);
    }
    else {
      console.log(`error with ${error}`)
    }
  }
  res.status(400).send(`Unable to empty user cart`); //default response
}



