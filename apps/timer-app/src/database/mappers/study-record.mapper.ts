import { StudyRecord } from '../domain/study-record';
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
}
