import request from 'supertest';
import { INestApplication } from '@nestjs/common';

import { TESTER_EMAIL, TESTER_PASSWORD } from '../utils/constants';
import { closeTestApp, initializeTestApp } from '../utils/test-utils';
import { loginUser } from '../utils/account-utils';
import { STATUS_MESSAGES } from 'apps/timer-app/src/utils/constants';

describe('Auth Module', () => {
  let app: INestApplication<any>;

  beforeAll(async () => {
    app = await initializeTestApp();
  });

  afterAll(async () => {
    await closeTestApp();
  });
  const newUserEmail = `testUser.${Date.now()}@test.com`;
  const newUserPassword = `qwer1234`;

  describe('POST /auth/email/register - 회원가입', () => {
    it('class-validator 확인', async () => {
      return request(app.getHttpServer())
        .post('/auth/email/register')
        .send({ email: 'wrongEmail', password: '' })
        .expect(400)
        .expect(({ body }) => {
          expect(body.status).toBe('error');
          expect(body.error).toBe(STATUS_MESSAGES.STATUS.VALIDATION);
          expect(Array.isArray(body.message)).toBeTruthy();
        });
    });

    it('이미 사용중인 이메일로 가입할 경우', async () => {
      return request(app.getHttpServer())
        .post('/auth/email/register')
        .send({
          email: TESTER_EMAIL,
          password: TESTER_PASSWORD,
        })
        .expect(400)
        .expect(({ body }) => {
          expect(body.status).toBe('error');
          expect(body.error).toBe(STATUS_MESSAGES.STATUS.BAD_REQUEST);
          expect(body.message).toBe(
            STATUS_MESSAGES.ACCOUNT.EMAIL_ALREADY_EXISTS,
          );
        });
    });

    it('회원가입 성공', async () => {
      return request(app.getHttpServer())
        .post('/auth/email/register')
        .send({
          email: newUserEmail,
          password: newUserPassword,
        })
        .expect(200)
        .expect(({ body }) => {
          expect(body.status).toBe('success');
          expect(body.data.access_token).toBeDefined();
          expect(body.data.refresh_token).toBeDefined();
          expect(body.data.expires_in).toBeDefined();
          expect(body.data.account.account_id).toBeDefined();
          expect(body.data.account.email).toBeDefined();
          expect(body.data.account.social_id).toBeDefined();
          expect(body.data.account.role).toBeDefined();
          expect(body.data.account.created_at).toBeDefined();
          expect(body.data.account.provider).toBeDefined();
          expect(body.data.account.password).not.toBeDefined();
        });
    });
  });

  describe('POST /auth/email/login - 로그인', () => {
    it('class-validator 확인', async () => {
      return request(app.getHttpServer())
        .post('/auth/email/login')
        .send({ email: 'wrongEmail', password: '' })
        .expect(400)
        .expect(({ body }) => {
          expect(body.status).toBe('error');
          expect(body.error).toBe(STATUS_MESSAGES.STATUS.VALIDATION);
          expect(Array.isArray(body.message)).toBeTruthy();
        });
    });

    it('잘못된 이메일로 로그인요청', async () => {
      return request(app.getHttpServer())
        .post('/auth/email/login')
        .send({ email: 'wrongEmail@test.com', password: newUserPassword })
        .expect(404)
        .expect(({ body }) => {
          expect(body.status).toBe('error');
          expect(body.error).toBe(STATUS_MESSAGES.STATUS.NOT_FOUND);
          expect(body.message).toBe(STATUS_MESSAGES.ACCOUNT.ACCOUNT_NOT_FOUND);
        });
    });

    it('패스워드가 틀림', async () => {
      return request(app.getHttpServer())
        .post('/auth/email/login')
        .send({ email: newUserEmail, password: 'wrongPassword' })
        .expect(401)
        .expect(({ body }) => {
          expect(body.status).toBe('error');
          expect(body.error).toBe(STATUS_MESSAGES.STATUS.UNAUTHORIZED);
          expect(body.message).toBe(STATUS_MESSAGES.ACCOUNT.PASSWORD_MISMATCH);
        });
    });

    it('로그인 성공', () => {
      return request(app.getHttpServer())
        .post('/auth/email/login')
        .send({ email: newUserEmail, password: newUserPassword })
        .expect(200)
        .expect(({ body }) => {
          expect(body.status).toBe('success');
          expect(body.data.access_token).toBeDefined();
          expect(body.data.refresh_token).toBeDefined();
          expect(body.data.expires_in).toBeDefined();
          expect(body.data.account.account_id).toBeDefined();
          expect(body.data.account.email).toBeDefined();
          expect(body.data.account.social_id).toBeDefined();
          expect(body.data.account.role).toBeDefined();
          expect(body.data.account.created_at).toBeDefined();
          expect(body.data.account.provider).toBeDefined();
          expect(body.data.account.password).not.toBeDefined();
        });
    });
  });

  describe('POST /auth/refresh - jwt토큰 리프레시', () => {
    it('리프레시 성공', async () => {
      const newUserRefreshToken = await request(app.getHttpServer())
        .post('/auth/email/login')
        .send({ email: newUserEmail, password: newUserPassword })
        .then(({ body }) => body.data.refresh_token);

      await request(app.getHttpServer())
        .post('/auth/refresh')
        .auth(newUserRefreshToken, {
          type: 'bearer',
        })
        .expect(200)
        .expect(({ body }) => {
          expect(body.status).toBe('success');
          expect(body.data.access_token).toBeDefined();
          expect(body.data.refresh_token).toBeDefined();
          expect(body.data.expires_in).toBeDefined();
        });
    });
  });

  describe('DELETE /auth/me - 계정 탈퇴', () => {
    it('잘못된 토큰', async () => {
      return request(app.getHttpServer())
        .delete('/auth/me')
        .auth('wrongToken', { type: 'bearer' })
        .expect(401)
        .expect(({ body }) => {
          expect(body.status).toBe('error');
          expect(body.error).toBe(STATUS_MESSAGES.STATUS.UNAUTHORIZED);
          expect(body.message).toBe(STATUS_MESSAGES.AUTH.INVALID_TOKEN);
        });
    });

    it('계정 탈퇴 성공', async () => {
      const { accessToken } = await loginUser(
        app,
        newUserEmail,
        newUserPassword,
      );

      await request(app.getHttpServer())
        .delete('/auth/me')
        .auth(accessToken, {
          type: 'bearer',
        })
        .expect(200);

      return request(app.getHttpServer())
        .post('/auth/email/login')
        .send({ email: newUserEmail, password: newUserPassword })
        .expect(404);
    });
  });
});
