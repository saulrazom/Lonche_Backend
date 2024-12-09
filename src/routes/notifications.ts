import { Router } from 'express';
import notificationController from '../controllers/notificationsController';

const router = Router();

/**
 * @swagger
 * /notifications/api/notifications/{id}:
 *   get:
 *     summary: Get notifications for a user
 *     tags: 
 *       - Notifications
 *     description: Retrieves all notifications for a user by their ID with an optional limit. If no limit is provided, it defaults to 10.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID to retrieve notifications for.
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Maximum number of notifications to retrieve.
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: A list of notifications for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 *       400:
 *         description: Invalid user ID or query parameters
 *       500:
 *         description: Internal server error
 */
router.get('/:id', notificationController.getNotifications);

/**
 * @swagger
 * notifications/api/notifications/:
 *   post:
 *     summary: Create a new notification
 *     tags:
 *       - Notifications
 *     description: Creates a new notification for a user based on the action type (like, comment, or follow).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sender:
 *                 type: string
 *                 description: The ID of the user sending the notification
 *               receiver:
 *                 type: string
 *                 description: The ID of the user receiving the notification
 *               type:
 *                 type: string
 *                 enum: ['like', 'comment', 'follow']
 *                 description: The type of notification
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: The date and time the notification was triggered
 *             required:
 *               - sender
 *               - receiver
 *               - type
 *               - date
 *     responses:
 *       201:
 *         description: Notification created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the notification was created successfully
 *                 message:
 *                   type: string
 *                   description: A message confirming the creation of the notification
 *                 data:
 *                   $ref: '#/components/schemas/Notification'
 *       400:
 *         description: Bad request, missing required fields
 *       500:
 *         description: Internal server error
 */
router.post('/', notificationController.createNotification);

export default router;
