import { Router } from 'express';
import sessionController from '../controllers/sessionController';
import passport from 'passport';
import { auth } from '../middlewares';

const sessionRoutes = Router();
/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     description: Logs in a user and returns authentication details.
 *     tags:
 *       - Login
 *     requestBody:
 *       description: User credentials for login
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful and user authenticated with the necessary permissions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     role:
 *                       type: string
 *                       example: "admin"
 *       403:
 *         description: User authenticated but does not have the necessary permissions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Authenticated but insufficient permissions"
 *       401:
 *         description: Invalid credentials or user not authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid username or password"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
sessionRoutes.post('/login', sessionController.login);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user, saves a 'user' cookie with the user data, and returns the created user's details.
 *     tags:
 *       - Register
 *     requestBody:
 *       description: User information for registration
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - name
 *               - lastname
 *               - birthdate
 *               - id_city
 *             properties:
 *               username:
 *                 type: string
 *                 example: "user1234"
 *                 description: "Required field. Must be unique and between 3 and 20 characters."
 *               email:
 *                 type: string
 *                 example: "user@user.com"
 *                 description: "Required field. Must be a valid email."
 *               password:
 *                 type: string
 *                 example: "superpassword"
 *                 description: "Required field. Minimum 6 characters."
 *               name:
 *                 type: string
 *                 example: "TheUser"
 *                 description: "Required field."
 *               lastname:
 *                 type: string
 *                 example: "Allan"
 *                 description: "Required field."
 *               birthdate:
 *                 type: string
 *                 format: date
 *                 example: "2000-10-20"
 *                 description: "Required field. Must be a valid date in the past."
 *               id_city:
 *                 type: string
 *                 example: "67071eb30079259fec39295b"
 *                 description: "Required field. Must reference a valid city ID."
 *
 *     responses:
 *       201:
 *         description: User successfully registered, and 'user' cookie saved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User successfully registered"
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       example: "user1234"
 *                     email:
 *                       type: string
 *                       example: "user@user.com"
 *                     name:
 *                       type: string
 *                       example: "TheUser"
 *                     lastname:
 *                       type: string
 *                       example: "Allan"
 *                     birthdate:
 *                       type: string
 *                       format: date
 *                       example: "2000-10-20"
 *                     id_city:
 *                       type: string
 *                       example: "67071eb30079259fec39295b"
 *                     role:
 *                       type: string
 *                       example: "user"
 *                     followers:
 *                      type: array
 *                      items:
 *                       type: string
 *                       example: "67071eb30079259fec39295b"
 *                     following:
 *                      type: array
 *                      items:
 *                       type: string
 *                       example: "67071eb30079259fec39295b"
 *                     numFollowers:
 *                      type: number
 *                      example: 1
 *                     numFollowing:
 *                      type: number
 *                      example: 1
 *                     joinDate:
 *                      type: string
 *                      format: date
 *                      example: "2021-10-20"
 *                     status:
 *                      type: string
 *                      example: "active"
 *                     _id:
 *                      type: string
 *                      example: "67071eb30079259fec39295b"
 *
 *
 *       400:
 *         description: Validation error or missing required fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation error"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "Username is required"
 *       409:
 *         description: Email or username already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email field already in use"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
sessionRoutes.post('/register', sessionController.register);

sessionRoutes.get('/profile', auth, sessionController.profile);

sessionRoutes.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

sessionRoutes.get(
  '/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    sessionController.loginWithGoogle(req, res);
  }
);

export default sessionRoutes;
