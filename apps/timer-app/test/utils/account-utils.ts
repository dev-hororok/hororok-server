import request from 'supertest';
import { Member } from 'apps/timer-app/src/database/domain/member';
import { API_URL } from './constants';

export const loginUser = async (
  email: string,
  password: string,
): Promise<{
  accessToken: string;
}> => {
  const response = await request(API_URL)
    .post('/timer-api/auth/email/login')
    .send({ email, password });
  return { accessToken: response.body.data.access_token };
};

export const getMember = async (
  accessToken: string,
): Promise<{
  member: Member;
}> => {
  const response = await request(API_URL)
    .get('/timer-api/members/me')
    .auth(accessToken, { type: 'bearer' });
  return { member: response.body.data.member };
};
