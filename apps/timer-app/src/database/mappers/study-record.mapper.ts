import { StudyRecord } from '../domain/study-record';
import { MemberEntity } from '../entities/member.entity';
import { StudyCategoryEntity } from '../entities/study-category.entity';
import { StudyRecordEntity } from '../entities/study-record.entity';
import { MemberMapper } from './member.mapper';
import { StudyCategoryMapper } from './study-category.mapper';

export class StudyRecordMapper {
  static toDomain(raw: StudyRecordEntity): StudyRecord {
    const studyRecord = new StudyRecord();

    studyRecord.study_record_id = raw.study_record_id;
    studyRecord.start_time = raw.start_time;
    studyRecord.end_time = raw.end_time;
    studyRecord.status = raw.status;

    if (raw.member) {
      studyRecord.member = MemberMapper.toDomain(raw.member);
    }
    if (raw.study_category) {
      studyRecord.study_category = StudyCategoryMapper.toDomain(
        raw.study_category,
      );
    }
    studyRecord.deleted_at = raw.deleted_at;

    return studyRecord;
  }

  static toPersistence(studyRecord: StudyRecord): StudyRecordEntity {
    let member: MemberEntity | undefined = undefined;

    if (studyRecord.member) {
      member = new MemberEntity();
      member.member_id = studyRecord.member.member_id;
    }

    let studyCategory: StudyCategoryEntity | undefined = undefined;

    if (studyRecord.study_category) {
      studyCategory = new StudyCategoryEntity();
      studyCategory.study_category_id =
        studyRecord.study_category.study_category_id;
    }

    const studyRecordEntity = new StudyRecordEntity();

    studyRecordEntity.study_record_id = studyRecord.study_record_id;
    studyRecordEntity.start_time = studyRecord.start_time;
    studyRecordEntity.end_time = studyRecord.end_time;
    studyRecordEntity.status = studyRecord.status;

    studyRecordEntity.member = member;
    studyRecordEntity.study_category = studyCategory;

    studyRecordEntity.deleted_at = studyRecord.deleted_at;

    return studyRecordEntity;
  }
}
