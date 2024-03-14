import { Injectable } from '@nestjs/common';
import { StudyRecordsService } from '../study-records/study-records.service';
import { MembersService } from '../members/services/members.service';
import { ItemInventoryService } from '../item-inventory/item-inventory.service';
import { EndStudyTimerInputDto } from './dtos/end.study-timer.dto';
import { TransactionService } from '../common/transaction.service';

@Injectable()
export class StudyTimerService {
  constructor(
    private readonly studyRecordsService: StudyRecordsService,
    private readonly membersService: MembersService,
    private readonly itemInventoryService: ItemInventoryService,

    private transactionService: TransactionService,
  ) {}

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

  /** startTime과 endTime의 차이를 seconds로 반환 */
  private calculateExperience(startTime: Date, endTime: Date): number {
    const endMilli = endTime.getTime();
    const startMilli = startTime.getTime();
    return (endMilli - startMilli) / 1000;
  }
}
