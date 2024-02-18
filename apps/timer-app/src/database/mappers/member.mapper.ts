import { Member } from '../domain/member';
import { MemberEntity } from '../entities/member.entity';
import { AccountMapper } from './account.mapper';
import { CharacterInventoryMapper } from './character-inventory.mapper';
import { ItemInventoryMapper } from './item-inventory.mapper';
import { StudyCategoryMapper } from './study-category.mapper';
import { StudyRecordMapper } from './study-record.mapper';
import { StudyStreakMapper } from './study-streak.mapper';
import { TransactionRecordMapper } from './transactionrecord.mapper';

export class MemberMapper {
  static toDomain(raw: MemberEntity): Member {
    const dto = new Member();

    dto.member_id = raw.member_id;
    dto.email = raw.email;
    dto.image_url = raw.image_url;
    dto.nickname = raw.nickname;
    dto.point = raw.point;
    dto.active_record_id = raw.active_record_id;

    if (raw.character_inventories) {
      dto.character_inventories = raw.character_inventories.map((n) =>
        CharacterInventoryMapper.toDomain(n),
      );
    }
    if (raw.item_inventories) {
      dto.item_inventories = raw.item_inventories.map((n) =>
        ItemInventoryMapper.toDomain(n),
      );
    }
    if (raw.study_categories) {
      dto.study_categories = raw.study_categories.map((n) =>
        StudyCategoryMapper.toDomain(n),
      );
    }
    if (raw.study_records) {
      dto.study_records = raw.study_records.map((n) =>
        StudyRecordMapper.toDomain(n),
      );
    }
    if (raw.transaction_records) {
      dto.transaction_records = raw.transaction_records.map((n) =>
        TransactionRecordMapper.toDomain(n),
      );
    }
    if (raw.study_streak) {
      dto.study_streak = StudyStreakMapper.toDomain(raw.study_streak);
    }
    if (raw.account) {
      dto.account = AccountMapper.toDomain(raw.account);
    }
    dto.created_at = raw.created_at;
    dto.updated_at = raw.updated_at;
    dto.deleted_at = raw.deleted_at;

    return dto;
  }
}
