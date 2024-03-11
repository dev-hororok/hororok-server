import { StudyRecord } from '../domain/study-record';
import { MemberEntity } from '../entities/member.entity';
import { StudyRecordEntity } from '../entities/study-record.entity';
import { MemberMapper } from './member.mapper';

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
    studyRecord.deleted_at = raw.deleted_at;

    return studyRecord;
  }

  static toPersistence(studyRecord: StudyRecord): StudyRecordEntity {
    let member: MemberEntity | undefined = undefined;

    if (studyRecord.member) {
      member = new MemberEntity();
      member.member_id = studyRecord.member.member_id;
    }

    const studyRecordEntity = new StudyRecordEntity();

    studyRecordEntity.study_record_id = studyRecord.study_record_id;
    studyRecordEntity.start_time = studyRecord.start_time;
    studyRecordEntity.end_time = studyRecord.end_time;
    studyRecordEntity.status = studyRecord.status;

    studyRecordEntity.member = member;

    studyRecordEntity.deleted_at = studyRecord.deleted_at;

    return studyRecordEntity;
  }
}
