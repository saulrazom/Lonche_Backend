import request from 'supertest';
import app from '../../index';
import HTTP_STATUS_CODES from '../../types/http-status-codes';

describe('POST /login', () => {
  it('should return 200 and a token if credentials are valid', async () => {
    const response = await request(app).post('/login').send({
      email: 'beto@correo2.com',
      password: 'salsa159',
    });

    expect(response.status).toBe(HTTP_STATUS_CODES.OK);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
  });

  it('should return 404 if credentials are invalid', async () => {
    const response = await request(app).post('/login').send({
      email: 'vsamuellopez@gmail.com',
      password: 'incorrectpassword',
    });

    expect(response.status).toBe(HTTP_STATUS_CODES.NOT_FOUND);
    expect(response.body).toHaveProperty(
      'message',
      'Invalid username or password'
    );
  });
});
