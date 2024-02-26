import request from 'supertest';
import { APP_URL, TESTER_EMAIL, TESTER_PASSWORD } from '../utils/constants';

describe('Auth Module', () => {
  const app = APP_URL;
  const newUserEmail = `testUser.${Date.now()}@test.com`;
  console.log(`Testing with new user email: ${newUserEmail}`);
  const newUserPassword = `qwer1234`;

  describe('Registration', () => {
    it('should fail with exists email: /timer-api/auth/email/register (POST)', async () => {
      console.log(
        `Attempting to register with existing email: ${TESTER_EMAIL}`,
      );
      const response = await request(app)
        .post('/timer-api/auth/email/register')
        .send({
          email: TESTER_EMAIL,
          password: TESTER_PASSWORD,
        });

      console.log(`Response status: ${response.status}`);
      console.log(`Response body: ${JSON.stringify(response.body)}`);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
      expect(response.body.error).toBe('Bad Request');
      expect(response.body.message).toBe('이미 사용중인 이메일입니다.');
    });

    it('should successfully with jwtToken: /timer-api/auth/email/register (POST)', async () => {
      return request(app)
        .post('/timer-api/auth/email/register')
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

    describe('Login', () => {
      it('should successfully with jwtToken: /timer-api/auth/email/login (POST)', () => {
        return request(app)
          .post('/timer-api/auth/email/login')
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
  });

  describe('Logged in user', () => {
    it('should get new refresh token: /timer-api/auth/refresh (GET)', async () => {
      const newUserRefreshToken = await request(app)
        .post('/timer-api/auth/email/login')
        .send({ email: newUserEmail, password: newUserPassword })
        .then(({ body }) => body.data.refresh_token);

      await request(app)
        .post('/timer-api/auth/refresh')
        .auth(newUserRefreshToken, {
          type: 'bearer',
        })
        .send()
        .expect(200)
        .expect(({ body }) => {
          expect(body.status).toBe('success');
          expect(body.data.access_token).toBeDefined();
          expect(body.data.refresh_token).toBeDefined();
          expect(body.data.expires_in).toBeDefined();
        });
    });

    it('should delete account successfully: /timer-api/auth/me (DELETE)', async () => {
      const accessToken = await request(app)
        .post('/timer-api/auth/email/login')
        .send({ email: newUserEmail, password: newUserPassword })
        .then(({ body }) => body.data.access_token);

      await request(app).delete('/timer-api/auth/me').auth(accessToken, {
        type: 'bearer',
      });

      return request(app)
        .post('/timer-api/auth/email/login')
        .send({ email: newUserEmail, password: newUserPassword })
        .expect(404);
    });
  });
});
