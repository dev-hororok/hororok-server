import { Injectable, NotFoundException } from '@nestjs/common';
import { StudyRecordsService } from '../study-records/study-records.service';
import { StartStudyTimerInputDto } from './dtos/start-study-timer.dto';
import { MembersService } from '../members/members.service';
import { ItemInventoryService } from '../item-inventory/item-inventory.service';

@Injectable()
export class StudyTimerService {
  constructor(
    private readonly studyRecordsService: StudyRecordsService,
    private readonly membersService: MembersService,
    private readonly itemInventoryService: ItemInventoryService,
  ) {}

  async start(account_id: string, body: StartStudyTimerInputDto) {
    const member = await this.membersService.findOneByAccountId(account_id);

    if (!member) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }

    if (member.active_record_id) {
      // 기존 레코드 삭제
      await this.studyRecordsService.delete(member.active_record_id);
    }

    // 새 레코드 생성
    const newRecord = await this.studyRecordsService.create({
      member_id: member.member_id,
      category_id: body.category_id,
    });

    await this.membersService.update(member.member_id, {
      active_record_id: newRecord.study_record_id,
    });
  }

  async end(account_id: string) {
    const member = await this.membersService.findOneByAccountId(account_id);
    if (!member) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }

    const existRecord = await this.studyRecordsService.findOne(
      member.active_record_id,
    );
    if (!existRecord) {
      throw new NotFoundException('진행중인 타이머가 없습니다.');
    }

    // 공부시간 계산
    const endMilli = new Date().getMilliseconds();
    const startMilli = existRecord.created_at.getMilliseconds();
    const exp = (endMilli - startMilli) / 1000;

    await this.studyRecordsService.update(existRecord.study_record_id, {
      duration: exp,
    });
    await this.membersService.update(member.member_id, {
      active_record_id: null,
    });

    // 유저가 가진 음식 progress 줄이기
    const itemInventory =
      await this.itemInventoryService.findByMemberIdAndItemType(
        member.member_id,
        'Food',
      );

    itemInventory.forEach(async (inventory) => {
      if (inventory.progress !== 0) {
        await this.itemInventoryService.update(inventory.item_inventory_id, {
          progress: inventory.progress - exp < 0 ? 0 : inventory.progress - exp,
        });
      }
    });

    return null;
  }
}
