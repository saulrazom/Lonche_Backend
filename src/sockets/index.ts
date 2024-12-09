import { Socket, Server } from 'socket.io';
import handleNotificationEvents from './notifications';

export const initializeSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.WEB_URL,
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type'],
      credentials: true,
    },
  });
  io.on('connection', (socket: Socket) => {
    console.log('New client connected');

    // Registrar manejadores de eventos específicos
    handleNotificationEvents(socket);

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
};
