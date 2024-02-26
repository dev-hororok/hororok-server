import request from 'supertest';
import { Test } from '@nestjs/testing';
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { TESTER_EMAIL, TESTER_PASSWORD } from '../utils/constants';
import { Interceptor } from 'apps/timer-app/src/config/interceptor';
import { CustomExceptionFilter } from 'apps/timer-app/src/config/filter';
import { TimerAppModule } from 'apps/timer-app/src/timer-app.module';

describe('Auth Module', () => {
  let app: INestApplication<any>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [TimerAppModule],
    }).compile();

    app = module.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.setGlobalPrefix('timer-api');

    app.useGlobalInterceptors(new Interceptor());
    app.useGlobalFilters(new CustomExceptionFilter());
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });
  const newUserEmail = `testUser.${Date.now()}@test.com`;
  const newUserPassword = `qwer1234`;

  describe('Registration', () => {
    it('should fail with exists email: /timer-api/auth/email/register (POST)', async () => {
      return request(app.getHttpServer())
        .post('/timer-api/auth/email/register')
        .send({
          email: TESTER_EMAIL,
          password: TESTER_PASSWORD,
        })
        .expect(400)
        .expect(({ body }) => {
          expect(body.status).toBe('error');
          expect(body.error).toBe('Bad Request');
          expect(body.message).toBe('이미 사용중인 이메일입니다.');
        });
    });

    it('should successfully with jwtToken: /timer-api/auth/email/register (POST)', async () => {
      return request(app.getHttpServer())
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
        return request(app.getHttpServer())
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
      const newUserRefreshToken = await request(app.getHttpServer())
        .post('/timer-api/auth/email/login')
        .send({ email: newUserEmail, password: newUserPassword })
        .then(({ body }) => body.data.refresh_token);

      await request(app.getHttpServer())
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
      const accessToken = await request(app.getHttpServer())
        .post('/timer-api/auth/email/login')
        .send({ email: newUserEmail, password: newUserPassword })
        .then(({ body }) => body.data.access_token);

      await request(app.getHttpServer())
        .delete('/timer-api/auth/me')
        .auth(accessToken, {
          type: 'bearer',
        });

      return request(app.getHttpServer())
        .post('/timer-api/auth/email/login')
        .send({ email: newUserEmail, password: newUserPassword })
        .expect(404);
    });
  });
});
