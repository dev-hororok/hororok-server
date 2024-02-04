import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StudyRecordsService } from '../study-records/study-records.service';
import { StartStudyTimerInputDto } from './dtos/start-study-timer.dto';
import { MembersService } from '../members/services/members.service';
import { ItemInventoryService } from '../item-inventory/item-inventory.service';
import { DataSource } from 'typeorm';
import { EndStudyTimerInputDto } from './dtos/end.study-timer.dto';

@Injectable()
export class StudyTimerService {
  constructor(
    private readonly studyRecordsService: StudyRecordsService,
    private readonly membersService: MembersService,
    private readonly itemInventoryService: ItemInventoryService,
    private dataSource: DataSource,
  ) {}

  async start(account_id: string, body: StartStudyTimerInputDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const member = await this.membersService.findOne(
        {
          where: {
            account_id,
          },
        },
        queryRunner,
      );
      if (!member) {
        throw new NotFoundException('유저가 존재하지 않습니다.');
      }

      if (member.active_record_id) {
        // 기존 레코드 삭제
        await this.studyRecordsService.delete(
          member.active_record_id,
          queryRunner,
        );
      }

      // 새 레코드 생성
      const newRecord = await this.studyRecordsService.create(
        {
          member_id: member.member_id,
          category_id: body.category_id,
        },
        queryRunner,
      );

      await this.membersService.update(
        member.member_id,
        {
          active_record_id: newRecord.study_record_id,
        },
        queryRunner,
      );
      await queryRunner.startTransaction();
      return null;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async end(account_id: string, data: EndStudyTimerInputDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const member = await this.membersService.findOne(
        {
          where: {
            account_id,
          },
        },
        queryRunner,
      );
      if (!member) {
        throw new NotFoundException('유저가 존재하지 않습니다.');
      }
      if (!member.active_record_id) {
        throw new NotFoundException('진행중인 타이머가 없습니다.');
      }
      const existRecord = await this.studyRecordsService.findOne(
        {
          where: {
            study_record_id: member.active_record_id,
          },
        },
        queryRunner,
      );
      if (!existRecord) {
        throw new NotFoundException('진행중인 타이머가 없습니다.');
      }

      // 공부시간 계산
      const endMilli = new Date().getTime();
      const startMilli = existRecord.created_at.getTime();

      const timeDiff = 0; // 9 * 60 * 60 * 1000; // KST - UTC 차이 (9시간)
      const exp = (endMilli - startMilli - timeDiff) / 1000; // start와 end요청시간의 간격

      // 업데이트를 요청한 duration이 실제 요청간격과 10분이상 차이나면 잘못된 요청 처리
      if (1000 * 60 * 10 <= Math.abs(data.duration - exp)) {
        throw new BadRequestException('잘못된 요청입니다.');
      }
      await this.studyRecordsService.update(
        existRecord.study_record_id,
        {
          duration: data.duration,
        },
        queryRunner,
      );
      await this.membersService.update(
        member.member_id,
        {
          active_record_id: null,
        },
        queryRunner,
      );

      // 유저가 가진 음식 progress 줄이기
      const memberFoods = await this.itemInventoryService.findAll(
        {
          where: { member: { member_id: member.member_id }, item_type: 'Food' },
        },
        queryRunner,
      );

      memberFoods.forEach(async (inventory) => {
        if (inventory.progress !== null && inventory.progress !== 0) {
          await this.itemInventoryService.update(
            inventory.item_inventory_id,
            {
              progress:
                inventory.progress - data.duration < 0
                  ? 0
                  : inventory.progress - data.duration,
            },
            queryRunner,
          );
        }
      });

      await queryRunner.commitTransaction();
      return null;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
