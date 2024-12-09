import { config } from 'dotenv';
config(); // Carga las variables de entorno desde el archivo .env
import HTTP_STATUS_CODES from './src/types/http-status-codes';

import mongoose from 'mongoose';
import { connectDB } from './src/config/db'; 

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.close(); // Cerrar la conexión después de las pruebas
});