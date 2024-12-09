import { Router } from 'express';
import usersController from '../controllers/usersController';
import { auth, selfUser, uploadS3 } from '../middlewares';
import ROLES from '../types/roles';

const usersRoutes = Router();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_city:
 *                type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               lastname:
 *                 type: string
 *               birthdate:
 *                 type: string
 *                 format: date
 *             required:
 *               - id_city
 *               - username
 *               - email
 *               - password
 *               - name
 *               - lastname
 *               - birthdate
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
usersRoutes.post('/', usersController.create);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *       500:
 *         description: Internal server error
 */
usersRoutes.get('/', usersController.getAll);

//TODO: Add swagger documentation
usersRoutes.get('/suggestions', auth, usersController.suggestions);

//TODO: Add swagger documentation
usersRoutes.post('/follow/:id', auth, usersController.follow);
usersRoutes.post('/unfollow/:id', auth, usersController.unfollow);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retrieve a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
usersRoutes.get('/:id', usersController.getById);

/**
 *  @swagger
 *  /users/{id}:
 *    put:
 *      summary: Update a user by ID
 *      tags: [Users]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: User ID
 *          schema:
 *            type: string
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                username:
 *                  type: string
 *                email:
 *                  type: string
 *                name:
 *                  type: string
 *                lastname:
 *                  type: string
 *                birthdate:
 *                  type: string
 *                  format: date
 *      responses:
 *        200:
 *          description: User updated successfully (Authenticated with permissions)
 *        403:
 *          description: User authenticated but without sufficient permissions
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "Authenticated but insufficient permissions"
 *        401:
 *          description: User not authenticated or invalid token
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "Not authenticated"
 *        404:
 *          description: User not found
 *        500:
 *          description: Internal server error
 */
usersRoutes.put(
  '/:id',
  auth,
  selfUser(),
  uploadS3.single('profilePic'),
  usersController.update
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully (Authenticated with permissions)
 *       403:
 *         description: User authenticated but without sufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Authenticated but insufficient permissions"
 *       401:
 *         description: User not authenticated or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Not authenticated"
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
usersRoutes.delete(
  '/:id',
  auth,
  selfUser([ROLES.ADMIN]),
  usersController.delete
);

export default usersRoutes;
