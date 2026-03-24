import { Request, Response } from 'express';
import { collections } from '../database';
import {  createUserSchema, updateUserSchema, User } from '../models/users'
import { ObjectId } from 'mongodb';
import * as argon2 from "argon2";




export const getUsers = async (req: Request, res: Response) => {
  //get all users from a database
  try {
    if (!collections.users) return res.status(500).json({ error: 'users collection not initialized' }); 

    const users = (await collections.users?.find({}).project({hashedPassword: false}).toArray()) as unknown as User[];
    res.status(200).send(users);
    return
  } catch (error) {
    if (error instanceof Error) {
      console.log(`issue with receiving ${error.message}`);
    }
    else {
      console.log(`error with ${error}`)
    }
  }
  res.status(400).send(`Unable to receive users`);

};


export const getUserById = async (req: Request, res: Response) => {
  //get a single  user by ID
  let id: string = req.params.id;
  try {
    const query = { _id: new ObjectId(id) };
    const user = (await collections.users?.findOne(query, {projection : {hashedPassword:false}})) as unknown as User;

    if (user) {
      res.status(200).send(user);
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
  res.status(400).send(`Unable to get the user`);
};


export const createUser = async (req: Request, res: Response) => {
  // create a new user in the database
  console.log(req.body);

  const { firstName, lastName, phonenumber, email, dob, address, password, role } = req.body;

  try {

    const existingUser = await collections.users?.findOne({email: email});

    if(existingUser){
      res.status(400).json({"error": "existing email"});
      return;
    }


  const newUser: User = { 
    firstName: firstName, 
    lastName: lastName, 
    phonenumber: phonenumber, 
    email: email, 
    password: password,
    role: role, 
    dob: new Date(dob), 
    address: address, 
    dateJoined: new Date(), 
    lastUpdated: new Date(),
    cartData: [] 
  }

  newUser.hashedPassword = await argon2.hash(password)
  
    const result = await collections.users?.insertOne(newUser)

    if (result) {
      const user = (await collections.users?.findOne(result.insertedId)) as unknown as User;
      res.status(201).location(`${result.insertedId}`).json(user)
      return;
    }
    else {
      res.status(500).json({"error":"Failed to create a new user."});
      return;
    }
  }
  catch (error) {
    if (error instanceof Error) {
      console.log(`issue with inserting ${error.message}`);
    }
    else {
      console.log(`error with ${error}`)
    }
    res.status(400).send(`Unable to create new user`);
  }
};


export const updateUser = async (req: Request, res: Response) => {
  //update a user in the database
  let id: string = req.params.id;

  // validtion of received data
  const validation = updateUserSchema.safeParse(req.body);
  
  if(!validation.success){
    return res.status(400).json({
      message: "Validation failed",
      errors: validation.error.issues
    });
  }

  const { firstName, lastName, phonenumber, address, password} = req.body; //no dob and email extraction
  const updatedUser = { 
    firstName: firstName, 
    lastName: lastName, 
    phonenumber: phonenumber, 
    address: address,
    password: password,
    lastUpdated: new Date()
  };
  
  try {
    const result = await collections.users?.updateOne({ "_id": new ObjectId(id) }, { $set: updatedUser })

    if (result) {
      const user = (await collections.users?.findOne(new ObjectId(id))) as unknown as User;
      console.log(user)
      res.status(201).location(`${result.upsertedId}`).json(user)
    }
    else {
      res.status(500).send("Failed to update a new user.");
    }
  }
  catch (error) {
    if (error instanceof Error) {
      console.log(`issue with inserting ${error.message}`);
    }
    else {
      console.log(`error with ${error}`)
    }
    res.status(400).send(`Unable to update new user`);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  // logic to delete user by ID from the database
  let id: string = req.params.id;
  try {
    const result = await collections.users?.deleteOne({ "_id": new ObjectId(id) })

    console.log(result)
    if (result?.deletedCount == 0) {
      res.status(404).json({message: "User not found"});
    }
    else {
      res.status(200).json({ message: `delete user ${req.params.id} from the database` });
    }
  }

  catch (error) {
    if (error instanceof Error) {
      console.log(`issue with deletion ${error.message}`);
    }
    else {
      console.log(`error with ${error}`)
    }
    res.status(400).send(`Unable to delete a user`);
  }  
};


