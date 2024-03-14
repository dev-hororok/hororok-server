import { Injectable, NotFoundException } from '@nestjs/common';
import { StudyRecordsService } from '../study-records/study-records.service';
import { MembersService } from '../members/services/members.service';
import { ItemInventoryService } from '../item-inventory/item-inventory.service';
import { EndStudyTimerInputDto } from './dtos/end-study-timer.dto';
import { TransactionService } from '../common/transaction.service';
import { InjectQueue } from '@nestjs/bull';
import Bull, { Queue } from 'bull';
import { PushPomodoroDto } from './dtos/push-pomodoro.dto';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { STATUS_MESSAGES } from '../utils/constants';

@Injectable()
export class StudyTimerService {
  constructor(
    @InjectQueue('pomodoro-timer') private pomodoroQueue: Queue,
    @InjectRedis() private readonly redisClient: Redis,

    private readonly studyRecordsService: StudyRecordsService,
    private readonly membersService: MembersService,
    private readonly itemInventoryService: ItemInventoryService,

    private transactionService: TransactionService,
  ) {}

  // 스터디 타이머 기록 시작
  async start(accountId: string) {
    return this.transactionService.executeInTransaction(async (queryRunner) => {
      const member = await this.membersService.findOneByAccountIdOrFail(
        accountId,
        queryRunner,
      );

      if (member.active_record_id) {
        try {
          // 기존 완료되지 않은 테이블이 있다면 재활용
          await this.studyRecordsService.update(
            member.active_record_id,
            {
              start_time: new Date(),
            },
            queryRunner,
          );

          return null;
        } catch (e) {
          // 에러 시 기존 테이블 제거 후 다음 로직 수행
          await this.studyRecordsService.softDelete(
            member.active_record_id,
            queryRunner,
          );
        }
      }

      const newRecord = await this.studyRecordsService.create(
        {
          member_id: member.member_id,
          start_time: new Date(),
        },
        queryRunner,
      );

      await this.membersService.updateActiveRecordId(
        member.member_id,
        newRecord.study_record_id,
        queryRunner,
      );

      return null;
    });
  }

  // 스터디 타이머 기록 종료
  async end(accountId: string, data: EndStudyTimerInputDto) {
    return this.transactionService.executeInTransaction(async (queryRunner) => {
      const member = await this.membersService.findOneByAccountIdOrFail(
        accountId,
        queryRunner,
      );
      const existRecord = await this.studyRecordsService.findActiveRecordOrFail(
        member.active_record_id,
        queryRunner,
      );

      const exp = this.calculateExperience(existRecord.start_time, new Date());

      await this.studyRecordsService.completeStudyRecord(
        existRecord.study_record_id,
        data.status,
        queryRunner,
      );
      await this.membersService.clearActiveRecordId(
        member.member_id,
        queryRunner,
      );

      await this.itemInventoryService.decreaseFoodProgressByExperience(
        member.member_id,
        exp,
        queryRunner,
      );

      return null;
    });
  }

  // 웹 푸시 알림 예약
  async schedulePomodoro(accountId: string, body: PushPomodoroDto) {
    const member =
      await this.membersService.findOneByAccountIdOrFail(accountId);

    // 기존에 예약된 타이머가 존재하면 취소
    const jobId = await this.getPomodoroJobId(member.member_id);
    if (jobId) {
      await this.cancelPomodoro(accountId);
    }

    const job = await this.pomodoroQueue.add(
      'pomodoroNotification',
      {
        memberId: member.member_id,
        body,
      },
      {
        delay: body.targetSeconds * 1000, // 밀리초 단위로 변환
      },
    );

    // redis에 job 정보 저장
    await this.addPomodoroJobId(member.member_id, job.id);

    return;
  }

  // 웹 푸시 알림 예약 취소
  async cancelPomodoro(accountId: string) {
    const member =
      await this.membersService.findOneByAccountIdOrFail(accountId);

    // Redis에서 JobId 조회
    const jobId = await this.getPomodoroJobId(member.member_id);

    if (!jobId) {
      throw new NotFoundException(
        STATUS_MESSAGES.RESOURCE.RESOURCE_NOT_FOUND('예약된 타이머'),
      );
    }

    // JobId를 사용하여 Bull Queue의 작업 취소
    const job = await this.pomodoroQueue.getJob(jobId);

    if (!job) {
      throw new NotFoundException(
        STATUS_MESSAGES.RESOURCE.RESOURCE_NOT_FOUND('예약된 타이머'),
      );
    }

    await job.remove();
    await this.deletePomodoroJobId(member.member_id); // 작업 취소 후 Redis에서 Job ID 삭제
    return;
  }

  async getPomodoroJobId(memberId: string): Promise<string | null> {
    const jobId = await this.redisClient.get(`pomodoro:${memberId}:jobId`);
    return jobId;
  }
  async deletePomodoroJobId(memberId: string): Promise<void> {
    await this.redisClient.del(`pomodoro:${memberId}:jobId`);
  }
  async addPomodoroJobId(memberId: string, jobId: Bull.JobId): Promise<void> {
    await this.redisClient.set(`pomodoro:${memberId}:jobId`, jobId);
  }

  /** startTime과 endTime의 차이를 seconds로 반환 */
  private calculateExperience(startTime: Date, endTime: Date): number {
    const endMilli = endTime.getTime();
    const startMilli = startTime.getTime();
    return (endMilli - startMilli) / 1000;
  }
}
