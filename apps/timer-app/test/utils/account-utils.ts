import request from 'supertest';
import { INestApplication } from '@nestjs/common';

export const loginUser = async (
  app: INestApplication,
  email: string,
  password: string,
): Promise<{
  accessToken: string;
}> => {
  const response = await request(app.getHttpServer())
    .post('/auth/email/login')
    .send({ email, password });
  return { accessToken: response.body.data.access_token };
};
