import { Member } from '../domain/member';
import { MemberEntity } from '../entities/member.entity';
import { AccountMapper } from './account.mapper';
import { CharacterInventoryMapper } from './character-inventory.mapper';
import { ItemInventoryMapper } from './item-inventory.mapper';
import { StudyRecordMapper } from './study-record.mapper';
import { StudyStreakMapper } from './study-streak.mapper';
import { TransactionRecordMapper } from './transactionrecord.mapper';

export class MemberMapper {
  static toDomain(raw: MemberEntity): Member {
    const dto = new Member();

    dto.member_id = raw.member_id;
    dto.status_message = raw.status_message;
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

  static toPersistence(member: Member): MemberEntity {
    const character_inventories = member.character_inventories
      ? member.character_inventories.map((n) =>
          CharacterInventoryMapper.toPersistence(n),
        )
      : undefined;
    const item_inventories = member.item_inventories
      ? member.item_inventories.map((n) => ItemInventoryMapper.toPersistence(n))
      : undefined;

    const study_records = member.study_records
      ? member.study_records.map((n) => StudyRecordMapper.toPersistence(n))
      : undefined;
    const transaction_records = member.transaction_records
      ? member.transaction_records.map((n) =>
          TransactionRecordMapper.toPersistence(n),
        )
      : undefined;

    const study_streak = member.study_streak
      ? StudyStreakMapper.toPersistence(member.study_streak)
      : undefined;
    const account = member.account
      ? AccountMapper.toPersistence(member.account)
      : undefined;

    const memberEntity = new MemberEntity();

    memberEntity.member_id = member.member_id;
    memberEntity.status_message = member.status_message;
    memberEntity.image_url = member.image_url;
    memberEntity.nickname = member.nickname;
    memberEntity.point = member.point;
    memberEntity.active_record_id = member.active_record_id;

    memberEntity.character_inventories = character_inventories;
    memberEntity.item_inventories = item_inventories;
    memberEntity.study_records = study_records;
    memberEntity.transaction_records = transaction_records;
    memberEntity.study_streak = study_streak;
    memberEntity.account = account;

    memberEntity.created_at = member.created_at;
    memberEntity.updated_at = member.updated_at;
    memberEntity.deleted_at = member.deleted_at;

    return memberEntity;
  }
}
