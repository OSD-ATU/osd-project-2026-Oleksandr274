import express, {Router} from 'express';
import { 
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCatagery
 } from '../controllers/products';
import { validate } from '../middleware/validate.middleware';
import { createProductSchema } from '../models/products';
import { isAdmin, validJWTProvided } from '../middleware/auth.middleware';

const router: Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API to manage Products
 */

/**
    * @swagger
    * /products:
    *   get:
    *     summary: Retrieve a list of products
    *     tags: [Products]
    *     responses:
    *       200:
    *         description: A list of products
    *       400:
    *         description: Unable to retrieve products
    */
router.get('/', getProducts);




/**
    * @swagger
    * /products/{id}:
    *   get:
    *     summary: Get a product by Id
    *     tags: [Products]
    *     parameters:
    *         - in: path
    *           name: id
    *           required: true
    *           description: Id of a product
    *     responses:
    *       200:
    *         description: The product
    *       400:
    *          description: Invalid Id supplied
    */
router.get('/:id', getProductById);

/**
    * @swagger
    * /products:
    *   post:
    *     summary: Create a product
    *     tags: [Products]
    *     requestBody:
    *       description: Create a new product
    *       content:
    *         application/json:
    *           schema:
    *             $ref: '#/components/schemas/Product'
    *       required: true
    *     responses:
    *       200:
    *         description: Product successfully created 
    *       400:
    *          description: Invalid input
    */
router.post('/', validJWTProvided, isAdmin, validate(createProductSchema), createProduct);

/**
    * @swagger
    * /products/{id}:
    *   put:
    *     summary: Update an existing product
    *     tags: [Products]
    *     parameters:
    *         - in: path
    *           name: id
    *           required: true
    *           description: Id of a product
    *     requestBody:
    *       description: Update an existing product by Id.
    *       content:
    *         application/json:
    *           schema:
    *             $ref: '#/components/schemas/Product'
    *       required: true
    *     responses:
    *       200:
    *         description: Product successfully updated 
    *       400:
    *          description: Invalid input
    */
router.put('/:id', validJWTProvided, isAdmin, updateProduct);

/**
    * @swagger
    * /products/{id}:
    *   delete:
    *     summary: Delete an existing product
    *     tags: [Products]
    *     parameters:
    *         - in: path
    *           name: id
    *           required: true
    *           description: Id of a product
    *     responses:
    *       200:
    *         description: Product successfully deleted 
    *       400:
    *          description: Invalid id supplied
    */
router.delete('/:id', validJWTProvided, isAdmin, deleteProduct);

export default router;
