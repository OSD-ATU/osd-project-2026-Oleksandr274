import { Request, Response } from 'express';
import { collections } from '../database';
import {  createProductSchema, updateProductSchema, Product } from '../models/products'
import { ObjectId } from 'mongodb';



export const getProducts = async (req: Request, res: Response) => {
  //get a list of products from a database
  try {
    if (!collections.products) 
      return res.status(500).json({ error: 'products collection not initialized' });

    let dbQuery = {};

    const reqcategory = req.query.category;

    if(reqcategory != undefined && reqcategory !== ''){
      dbQuery = {category: reqcategory}
    }

    console.log(dbQuery)

    const products = (await collections.products?.find(dbQuery).toArray()) as unknown as Product[];
    
    if(products.length > 0)
      return res.status(200).send(products);
    else
      return res.status(404).json({message: "products not found"});
  } catch (error) {
    if (error instanceof Error) {
      console.log(`issue with receiving ${error.message}`);
    }
    else {
      console.log(`error with ${error}`)
    }
  }
  res.status(400).send(`Unable to receive products`); //default response
};


export const getProductById = async (req: Request, res: Response) => {
  //get a single  product by ID
  let id: any = req.params.id;
  try {
    const query = { _id: new ObjectId(id) };
    const product = (await collections.products?.findOne(query)) as unknown as Product;

    if (product) {
      return res.status(200).send(product);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(`error message ${error.message}`);
    }
    else {
      console.log(`error with ${error}`)
    }
  }
  res.status(400).send(`Unable to get the product`); //default response
};


export const createProduct = async (req: Request, res: Response) => {
  // create a new product in the database
  console.log(req.body);

  const { title, images, category, price, brand, description } = req.body;
  const newproduct: Product = { 
    title: title,
    images: images,
    category: category,
    price : price,
    brand: brand,
    description: description,
    datePosted: new Date(),
    lastUpdated: new Date(),
  }

  try {
    const result = await collections.products?.insertOne(newproduct)

    if (result) {
      const product = (await collections.products?.findOne(result.insertedId)) as unknown as Product;
      res.status(201).location(`${result.insertedId}`).json(product);
    }
    else {
      res.status(500).send("Failed to create a new product.");
    }
    return
  }
  catch (error) {
    if (error instanceof Error) {
      console.log(`issue with inserting ${error.message}`);
    }
    else {
      console.log(`error with ${error}`)
    }
  }
  res.status(400).send(`Unable to create new product`); //default response
};


export const updateProduct = async (req: Request, res: Response) => {
  //update a product in the database
  let id: any = req.params.id;

  // validtion of received data
  const validation = updateProductSchema.safeParse(req.body);
  
  if(!validation.success){
    return res.status(400).json({
      message: "Validation failed",
      errors: validation.error.issues
    });
  }

  const { title, images, category, price, brand, description } = req.body;
  const updatedProduct: Product = { 
    title: title,
    images: images,
    category: category,
    price : price,
    brand: brand,
    description: description,
    lastUpdated: new Date()
  }
  
  try {
    const result = await collections.products?.updateOne({ "_id": new ObjectId(id) }, { $set: updatedProduct })

    if (result) {
      const product = (await collections.products?.findOne(new ObjectId(id))) as unknown as Product;
      console.log(product)
      res.status(201).location(`${result.upsertedId}`).json(product)
    }
    else {
      res.status(500).send("Failed to update a new product.");
    }

    return
  }
  catch (error) {
    if (error instanceof Error) {
      console.log(`issue with inserting ${error.message}`);
    }
    else {
      console.log(`error with ${error}`)
    }
  }
  res.status(400).send(`Unable to update new product`); //default response
};

export const deleteProduct = async (req: Request, res: Response) => {
  // logic to delete product by ID from the database
  let id: any = req.params.id;
  try {
    const result = await collections.products?.deleteOne({ "_id": new ObjectId(id) })

    console.log(result)
    if (result?.deletedCount == 0) {
      res.status(404).json({message: "product not found"});
    }
    else {
      res.status(200).json({ message: `delete product ${req.params.id} from the database` });
    }
    return
  }

  catch (error) {
    if (error instanceof Error) {
      console.log(`issue with deletion ${error.message}`);
    }
    else {
      console.log(`error with ${error}`)
    }
  }  
  res.status(400).send(`Unable to delete a product`);
};

export const getProductsByCatagery = async (req: Request, res: Response) => {
  //get a list of products filtered by category
  let categoryName: string = req.query.category as string;

  console.log(categoryName)

  try {
    const query = {category: categoryName  };
    const products = (await collections.products?.find(query).toArray())  as unknown as Product[];

    if (products) {
      return res.status(200).send(products);
    }
    
  } catch (error) {
    if (error instanceof Error) {
      console.log(`error message ${error.message}`);
    }
    else {
      console.log(`error with ${error}`)
    }
  }
  res.status(400).send(`Unable to get the products`);
}


