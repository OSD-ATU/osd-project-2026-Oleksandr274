import express, { Application, Request, Response } from "express";
import userRoutes from './routes/users';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import authRoutes from './routes/auth';
import cartRoutes from './routes/cart';
import checkoutRoutes from './routes/checkout';
import morgan from "morgan";
import dotenv from "dotenv";
import { initDb } from "./database";
import cors from 'cors';

import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

import {swaggerOptions} from './swagger';
import { validJWTProvided } from "./middleware/auth.middleware";

dotenv.config();

export const app: Application = express();
initDb();

app.use(morgan("tiny"));
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

dotenv.config();




const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/v1/users', userRoutes)
app.use('/api/v1/products', productRoutes)
app.use('/api/v1/orders', validJWTProvided, orderRoutes)
app.use('/api/v1/auth', authRoutes )
app.use('/api/v1/cart', validJWTProvided, cartRoutes)
app.use('/api/v1/checkout', validJWTProvided, checkoutRoutes)

app.get("/ping", async (_req : Request, res: Response) => {
    res.json({ message: "hello from Alex" });
});


