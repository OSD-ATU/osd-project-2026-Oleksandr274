import express, { Router } from 'express';
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
} from '../controllers/users';
import { validate } from '../middleware/validate.middleware';
import { createUserSchema } from '../models/users';
import { isAdmin, validJWTProvided } from '../middleware/auth.middleware';

const router: Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API to manage Users
 */

/**
    * @swagger
    * /users:
    *   get:
    *     summary: Retrieve a list of users
    *     tags: [Users]
    *     responses:
    *       200:
    *         description: A list of users
    *       400:
    *         description: Unable to retrieve users
    */
router.get('/', validJWTProvided, isAdmin, getUsers);

/**
    * @swagger
    * /users/{id}:
    *   get:
    *     summary: Get a user by Id
    *     tags: [Users]
    *     parameters:
    *         - in: path
    *           name: id
    *           required: true
    *           description: Id of a user
    *     responses:
    *       200:
    *         description: The user
    *       400:
    *          description: Invalid Id supplied
    */
router.get('/:id', getUserById);

/**
    * @swagger
    * /users:
    *   post:
    *     summary: Create a user
    *     tags: [Users]
    *     requestBody:
    *       description: Create a new user
    *       content:
    *         application/json:
    *           schema:
    *             $ref: '#/components/schemas/User'
    *       required: true
    *     responses:
    *       200:
    *         description: User successfully created 
    *       400:
    *          description: Invalid input
    */
router.post('/', validate(createUserSchema), createUser);

/**
    * @swagger
    * /users/{id}:
    *   put:
    *     summary: Update an existing user
    *     tags: [Users]
    *     parameters:
    *         - in: path
    *           name: id
    *           required: true
    *           description: Id of a user
    *     requestBody:
    *       description: Update an existing user by Id.
    *       content:
    *         application/json:
    *           schema:
    *             $ref: '#/components/schemas/User'
    *       required: true
    *     responses:
    *       200:
    *         description: User successfully updated 
    *       400:
    *          description: Invalid input
    */
router.put('/:id', updateUser);

/**
    * @swagger
    * /users/{id}:
    *   delete:
    *     summary: Delete an existing user
    *     tags: [Users]
    *     parameters:
    *         - in: path
    *           name: id
    *           required: true
    *           description: Id of a user
    *     responses:
    *       200:
    *         description: User successfully deleted 
    *       400:
    *          description: Invalid id supplied
    */
router.delete('/:id', validJWTProvided, deleteUser);

export default router;