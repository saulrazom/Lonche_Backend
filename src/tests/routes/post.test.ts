import request from 'supertest'; // Paquete para hacer solicitudes HTTP en pruebas
import app from '../../index';
import HTTP_STATUS_CODES from '../../types/http-status-codes';
import jwt from 'jsonwebtoken';

//El usuario quiere hacer post y no esta loggeado
describe('POST /posts', () => {
    it('should return 401 if the user is not logged in', async () => {
        const response = await request(app)
            .post('/posts')
            .send({});  // Enviar un post vacío

        expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);  // Esperamos un error 401
        expect(response.body).toHaveProperty('message', 'Unauthorized: Token missing');  // Mensaje de error correcto
    });

    // El usuario está logueado, pero faltan campos requeridos
    it('should return 400 if required fields are missing when logged in', async () => {
        // Primero, hacer login para obtener un token JWT
        const loginResponse = await request(app)
            .post('/login')  // Asegúrate de que esta sea la ruta correcta de login
            .send({
                email: 'beto@correo2.com',
                password: 'salsa159', // Sustituye con credenciales válidas de tu base de datos
            });

        const token = loginResponse.body.token;  // Asumiendo que el token está en el cuerpo de la respuesta
        console.log('Token es: ', token);

        const response = await request(app)
            .post('/posts')
            .set('Authorization', `Bearer ${token}`)  // Usar el token obtenido en la solicitud
            .send({});  // Enviar un post vacío

        expect(response.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST);  // Esperamos un error 400 por validación de campos
        expect(response.body).toHaveProperty('message', 'Categories are required and must be an array'); // Mensaje actual

    });
});