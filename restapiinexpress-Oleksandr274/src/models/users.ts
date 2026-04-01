import { ObjectId } from "mongodb";
import z, { date } from "zod";
import { Item } from "./item";

export interface User {
    _id?: ObjectId;
    firstName: string;
    lastName: string;
    phonenumber: string;
    email: string;
    password: string;
    hashedPassword?: string;
    role?: role;
    dob: Date;
    address: string;
    dateJoined: Date;
    lastUpdated: Date;
    cartData: Item[]; 
}

enum role {admin, editor, ''}

export const createUserSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phonenumber: z.string().regex(/^\+(353)\d{9}$/).trim(),
    email: z.email(),
    password: z.string().min(8).max(64),
    role: z.enum(['admin', 'editor', '']),
    dob: z.coerce.date().refine((date) => date <= new Date(), { message: 'dob cannot be in the future' }),
    address: z.string().min(4),
})

export const updateUserSchema = z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    phonenumber: z.string().regex(/^\+(353)\d{9}$/).trim().optional(),

    password: z.string().min(8).max(64).optional(),

    address: z.string().min(4).optional(),
}).strict();


