import request from 'supertest';
import app from '../../index';
import HTTP_STATUS_CODES from '../../types/http-status-codes';

const getToken = async () => {
  const response = await request(app).post('/login').send({
    email: 'saulrazo900@gmail.com',
    password: 'ratacalva',
  });
  return response.body.token;
};

import { Response } from 'supertest';

const checkProfileResponse = (response: Response) => {
  expect(response.status).toBe(HTTP_STATUS_CODES.OK);
  expect(response.body).toHaveProperty('id_city');
  expect(response.body).toHaveProperty('username');
  expect(response.body).toHaveProperty('email');
  expect(response.body).not.toHaveProperty('password');
};

describe('POST /profile', () => {
  it(`should return ${HTTP_STATUS_CODES.OK} if the token is valid`, async () => {
    const token = await getToken();
    const profileResponse = await request(app)
      .get('/profile')
      .set('Authorization', `Bearer ${token}`);
    
    checkProfileResponse(profileResponse);
  });

  it(`should return ${HTTP_STATUS_CODES.UNAUTHORIZED} if the token is invalid`, async () => {
    const profileResponse = await request(app)
      .get('/profile')
      .set('Authorization', `Bearer invalidtoken`);

    expect(profileResponse.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
  });
});
