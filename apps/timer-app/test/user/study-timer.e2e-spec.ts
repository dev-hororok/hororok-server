import request from 'supertest';

import { API_URL, TESTER_EMAIL, TESTER_PASSWORD } from '../utils/constants';
import { getMember, loginUser } from '../utils/account-utils';
import { Member } from 'apps/timer-app/src/database/domain/member';
import { STATUS_MESSAGES } from 'apps/timer-app/src/utils/constants';

describe('StudyTimer Module', () => {
  let accessToken: string;
  let member: Member;
  beforeAll(async () => {
    const userAccessToken = await loginUser(TESTER_EMAIL, TESTER_PASSWORD);
    accessToken = userAccessToken.accessToken;
    member = (await getMember(accessToken)).member;
  });

  describe('POST /study-timer/start - 타이머 시작, POST /study-timer/end - 타이머 종료 ', () => {
    it('토큰이 유효하지 않은경우', async () => {
      await request(API_URL)
        .post(`/timer-api/study-timer/start`)
        .auth('expiredToken', {
          type: 'bearer',
        })
        .expect(401)
        .expect(({ body }) => {
          expect(body.status).toBe('error');
          expect(body.error).toBe(STATUS_MESSAGES.STATUS.UNAUTHORIZED);
          expect(body.message).toBe(STATUS_MESSAGES.AUTH.INVALID_TOKEN);
        });

      await request(API_URL)
        .post(`/timer-api/study-timer/end`)
        .auth('expiredToken', {
          type: 'bearer',
        })
        .send({ status: 'Completed' })
        .expect((res) => {
          expect(res.status).toBe(401);
          expect(res.body.status).toBe('error');
          expect(res.body.error).toBe(STATUS_MESSAGES.STATUS.UNAUTHORIZED);
          expect(res.body.message).toBe(STATUS_MESSAGES.AUTH.INVALID_TOKEN);
        });
    });

    it('class-validator 확인', async () => {
      await request(API_URL)
        .post(`/timer-api/study-timer/end`)
        .auth(accessToken, {
          type: 'bearer',
        })
        .send({})
        .expect((res) => {
          expect(res.status).toBe(400);
          expect(res.body.status).toBe('error');
          expect(res.body.error).toBe(STATUS_MESSAGES.STATUS.VALIDATION);
          expect(Array.isArray(res.body.message)).toBeTruthy();
        });
    });

    it('스터디 타이머 시작', async () => {
      await request(API_URL)
        .post(`/timer-api/study-timer/start`)
        .auth(accessToken, {
          type: 'bearer',
        })
        .expect(200)
        .expect(({ body }) => {
          expect(body.status).toBe('success');
        });
      member = (await getMember(accessToken)).member;
      expect(member.active_record_id).toBeDefined();
    });
    it('스터디 타이머 종료 성공', async () => {
      await request(API_URL)
        .post(`/timer-api/study-timer/end`)
        .auth(accessToken, {
          type: 'bearer',
        })
        .send({ status: 'Completed' }) // Completed, Incompleted
        .expect((res) => {
          expect(res.status).toBe(200);
          expect(res.body.status).toBe('success');
        });
      member = (await getMember(accessToken)).member;
      expect(member.active_record_id).toBeNull();
    });
  });
});
