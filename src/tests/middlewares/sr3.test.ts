import request from 'supertest';
import app from '../../index';
import HTTP_STATUS_CODES from '../../types/http-status-codes';
import fs from 'fs';
import path from 'path';

describe('POST /posts', () => {
  it(`should return ${HTTP_STATUS_CODES.CREATED} when a file is uploaded successfully`, async () => {
    const loginResponse = await request(app).post('/login').send({
      email: 'beto@correo2.com',
      password: 'salsa159',
    });

    const token = loginResponse.body.token;
    const user = loginResponse.body.user;

    const filePath = path.join(
      __dirname,
      '..',
      '..',
      'tests',
      'middlewares',
      'mozo.jpeg'
    );

    const fileBuffer = fs.readFileSync(filePath);

    // Enviar las categorías como un arreglo sin JSON.stringify
    const response = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .field('id_city', user.id_city)
      .field('id_user', user._id)
      .field('username', user.username)
      .field('title', 'Mi primera publicación')
      .field('content', 'Contenido de mi primera publicación')
      .field('categories', 'cultura')
      .field('categories', 'comida')
      .attach('file', fileBuffer, 'mozo.jpeg');

    console.log(response.body);

    expect(response.status).toBe(HTTP_STATUS_CODES.CREATED);
    expect(response.body).toHaveProperty('title', 'Mi primera publicación');
    expect(response.body).toHaveProperty(
      'content',
      'Contenido de mi primera publicación'
    );
    expect(response.body).toHaveProperty('categories', ['cultura', 'comida']);
    expect(response.body).toHaveProperty('mediaURL');
  });

  it(`It sholud also return ${HTTP_STATUS_CODES.CREATED} when no file is uploaded but all the fields are correct`, async () => {
    const loginResponse = await request(app).post('/login').send({
      email: 'beto@correo2.com',
      password: 'salsa159',
    });

    const token = loginResponse.body.token;
    const user = loginResponse.body.user;

    // Aquí también enviamos el campo 'categories' aunque no se suba archivo
    const response = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        categories: ['cultura', 'comida'],
        id_city: user.id_city,
        id_user: user._id,
        username: user.username,
        title: 'Mi primera publicación',
        content: 'Contenido de mi primera publicación',
      });

    console.log(response.body);

    expect(response.status).toBe(HTTP_STATUS_CODES.CREATED);
    expect(response.body).toHaveProperty('title', 'Mi primera publicación');
    expect(response.body).toHaveProperty(
      'content',
      'Contenido de mi primera publicación'
    );
    expect(response.body).toHaveProperty('categories', ['cultura', 'comida']);
    expect(response.body).not.toHaveProperty('mediaURL');
  });

  it(`should return ${HTTP_STATUS_CODES.BAD_REQUEST} when some fields are missing`, async () => {
    const loginResponse = await request(app).post('/login').send({
      email: 'beto@correo2.com',
      password: 'salsa159',
    });

    const token = loginResponse.body.token;
    const user = loginResponse.body.user;

    const response = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        categories: ['cultura', 'comida'],
        id_city: user.id_city,
        id_user: user._id,
        username: user.username,
        title: 'Mi primera publicación',
      });

    console.log(response.body);

    expect(response.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST);
    expect(response.body).toHaveProperty('message', 'Validation error');
    expect(response.body).toHaveProperty('errors');
  });
});
