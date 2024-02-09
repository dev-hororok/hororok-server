import { Injectable } from '@nestjs/common';
import { StudyRecordsService } from '../study-records/study-records.service';
import { StartStudyTimerInputDto } from './dtos/start-study-timer.dto';
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

  async start(accountId: string, body: StartStudyTimerInputDto) {
    return this.transactionService.executeInTransaction(async (queryRunner) => {
      const member = await this.membersService.findOneByAccountIdOrFail(
        accountId,
        queryRunner,
      );

      if (member.active_record_id) {
        await this.studyRecordsService.delete(
          member.active_record_id,
          queryRunner,
        );
      }

      const newRecord = await this.studyRecordsService.create(
        {
          member_id: member.member_id,
          category_id: body.category_id,
          start_time: new Date(),
        },
        queryRunner,
      );

      const isUpdated = await this.membersService.updateActiveRecordId(
        member.member_id,
        newRecord.study_record_id,
        queryRunner,
      );

      // account-member의 키값은 직접 업데이트 해야함
      if (isUpdated) {
        await this.membersService.updateMemberCache(
          `account-member_${accountId}`,
          {
            ...member,
            active_record_id: newRecord.study_record_id,
          },
        );
      }
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
      const isUpdated = await this.membersService.clearActiveRecordId(
        member.member_id,
        queryRunner,
      );

      // account-member의 키값은 직접 업데이트 해야함
      if (isUpdated) {
        await this.membersService.updateMemberCache(
          `account-member_${accountId}`,
          {
            ...member,
            active_record_id: null,
          },
        );
      }

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
