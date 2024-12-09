import { config } from 'dotenv';
config();
import express from 'express';
import { connectDB } from './config/db';
import cors from 'cors';
import routes from './routes';
import cookieParser from 'cookie-parser';
import { initializeSocket } from './sockets';

connectDB();

const app = express();
const port = process.env.PORT ?? 3000;

app.disable('x-powered-by');

// Configuración de CORS
const corsOptions = {
  origin: process.env.WEB_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Uso de CORS
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser(process.env.SECRET_COOKIE_KEY as string));
app.use(routes);

if (process.env.NODE_ENV !== 'test') {  // Solo inicia el servidor si no estamos en test
  const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
  initializeSocket(server);
}

export default app;  // Exporta la instancia de app para pruebas
