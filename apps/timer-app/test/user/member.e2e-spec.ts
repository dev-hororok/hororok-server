import request from 'supertest';

import { API_URL, TESTER_EMAIL, TESTER_PASSWORD } from '../utils/constants';
import { loginUser } from '../utils/account-utils';
import { Member } from 'apps/timer-app/src/database/domain/member';
import { STATUS_MESSAGES } from 'apps/timer-app/src/utils/constants';

describe('Member Module', () => {
  let accessToken: string;
  let member: Member;

  beforeAll(async () => {
    const userAccessToken = await loginUser(TESTER_EMAIL, TESTER_PASSWORD);
    accessToken = userAccessToken.accessToken;
  });

  describe('GET /members/me - 현재 유저 정보 조회', () => {
    it('토큰이 유효하지 않은경우', async () => {
      await request(API_URL)
        .get('/timer-api/members/me')
        .auth('expiredToken', {
          type: 'bearer',
        })
        .expect(401)
        .expect(({ body }) => {
          expect(body.status).toBe('error');
          expect(body.error).toBe(STATUS_MESSAGES.STATUS.UNAUTHORIZED);
          expect(body.message).toBe(STATUS_MESSAGES.AUTH.INVALID_TOKEN);
        });
    });

    it('성공', async () => {
      await request(API_URL)
        .get('/timer-api/members/me')
        .auth(accessToken, {
          type: 'bearer',
        })
        .expect(200)
        .expect(({ body }) => {
          member = body.data.member;
          expect(body.status).toBe('success');
          expect(member.member_id).toBeDefined();
          expect(member.status_message).toBeDefined();
          expect(member.image_url).toBeDefined();
          expect(member.nickname).toBeDefined();
          expect(member.point).toBeDefined();
          expect(member.active_record_id).toBeDefined();
        });
    });
  });

  describe('PATCH /members/:member_id - 유저 정보 수정', () => {
    const updateData = {
      nickname: `name.${Date.now()}`,
      image_url: `http://test.com/${Date.now()}.jpg`,
      status_message: `message.${Date.now()}`,
    };

    it('토큰이 유효하지 않은경우', async () => {
      await request(API_URL)
        .patch(`/timer-api/members/${member.member_id}`)
        .auth('expiredToken', {
          type: 'bearer',
        })
        .expect(401)
        .expect(({ body }) => {
          expect(body.status).toBe('error');
          expect(body.error).toBe(STATUS_MESSAGES.STATUS.UNAUTHORIZED);
          expect(body.message).toBe(STATUS_MESSAGES.AUTH.INVALID_TOKEN);
        });
    });

    it('내 member_id가 아닌 다른 member_id로 수정을 시도하는 경우', async () => {
      await request(API_URL)
        .patch(`/timer-api/members/testtet2132`)
        .auth(accessToken, {
          type: 'bearer',
        })
        .send(updateData)
        .expect(403)
        .expect(({ body }) => {
          expect(body.status).toBe('error');
          expect(body.error).toBe(STATUS_MESSAGES.STATUS.FORBIDDEN);
          expect(body.message).toBe(STATUS_MESSAGES.AUTH.FORBIDDEN);
        });
    });

    it('body가 비어있는 경우', async () => {
      await request(API_URL)
        .patch(`/timer-api/members/${member.member_id}`)
        .auth(accessToken, {
          type: 'bearer',
        })
        .expect(400)
        .expect(({ body }) => {
          expect(body.status).toBe('error');
          expect(body.error).toBe(STATUS_MESSAGES.STATUS.BAD_REQUEST);
          expect(body.message).toBe(STATUS_MESSAGES.VALIDATION.NO_CONTENT);
        });
    });

    it('성공', async () => {
      await request(API_URL)
        .patch(`/timer-api/members/${member.member_id}`)
        .auth(accessToken, {
          type: 'bearer',
        })
        .send(updateData)
        .expect(200);

      await request(API_URL)
        .get('/timer-api/members/me')
        .auth(accessToken, {
          type: 'bearer',
        })
        .expect(200)
        .expect(({ body }) => {
          member = body.data.member;
          expect(member.member_id).toBe(member.member_id);
          expect(member.status_message).toBe(updateData.status_message);
          expect(member.image_url).toBe(updateData.image_url);
          expect(member.nickname).toBe(updateData.nickname);
          expect(member.point).toBe(member.point);
          expect(member.active_record_id).toBe(member.active_record_id);
        });
    });
  });
});
