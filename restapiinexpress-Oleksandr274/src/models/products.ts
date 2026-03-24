import { ObjectId } from "mongodb";
import z, { date, string } from "zod";

export interface Product {
    _id?: ObjectId;
    title: string;
    images: [string];
    category: string;
    price: number;
    brand: string;
    description: string;
    datePosted?: Date;
    lastUpdated?: Date;
}

export const createProductSchema = z.object({
    title: z.string().min(3),
    images: z.array(string()),
    category: z.string().min(3),
    price: z.number().positive(),
    brand: z.string().min(2),
    description: z.string().optional(),
})

export const updateProductSchema = z.object({
    title: z.string().min(3).optional(),
    images: z.array(string()).optional(),
    category: z.string().min(3).optional(),
    price: z.number().positive().optional(),
    brand: z.string().min(2).optional(),
    description: z.string().optional(),
}).strict();