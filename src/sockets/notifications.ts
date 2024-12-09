import { Socket } from 'socket.io';
import NotificationPayload from '../types/NotificationPayload';
import Notification from '../models/Notification';

const handleNotificationEvents = (socket: Socket) => {
  console.log('Handling notification events');

  socket.on('joinRoom', (userId: string) => {
    socket.join(userId);
    console.log(`User joined room: ${userId}`);
  });

  socket.on('sendPostNotification', async (data: NotificationPayload) => {
    // comment | like
    const { id_user, id_post, id_receiver, username, actionType } = data;
    const timestamp = new Date().toISOString();

    const newNotification = new Notification({
      sender: id_user,
      receiver: id_receiver,
      username: username,
      type: actionType, // like | comment
      post: id_post, // ID del post
      timestamp: timestamp,
    });

    try {
      // Guardar la notificación en la base de datos
      await newNotification.save();
      console.log('Notification saved to database:', newNotification);

      // Emitir la notificación al receptor
      const notification = {
        username,
        actionType,
        id_post,
        timestamp,
      };
      socket.to(id_receiver).emit('receiveNotification', notification);
    } catch (error) {
      console.error('Error saving notification to database:', error);
    }
  });

  socket.on('sendFollowNotification', async (data: NotificationPayload) => {
    const { id_user, username, id_receiver } = data;
    const timestamp = new Date().toISOString();

    // Crear la notificación en la base de datos
    const newNotification = new Notification({
      sender: id_user,
      receiver: id_receiver,
      username: username,
      type: 'follow',
      timestamp: timestamp,
    });

    try {
      // Guardar la notificación en la base de datos
      await newNotification.save();
      console.log('Follow notification saved to database:', newNotification);

      // Emitir la notificación al receptor
      const notification = {
        type: 'follow',
        username,
        timestamp,
      };
      socket.to(id_receiver).emit('receiveNotification', notification);
    } catch (error) {
      console.error('Error saving follow notification to database:', error);
    }
  });
};

// GET /api/notifications/:id
// -> TODAS las notificaiónes de un usuario
// 1 - Modelo y socket
// 2 - Controlador para el GET
// 3 - Ruta para el GET

export default handleNotificationEvents;
