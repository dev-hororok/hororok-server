import { ReadOnlyStudyRecordDto } from '../dtos/readonly-study-record.dto';
import { StudyRecord } from '../entities/study-record.entity';
import { StudyCategoryMapper } from './study-category.mapper';

export class StudyRecordMapper {
  static toDto(study_record: StudyRecord): ReadOnlyStudyRecordDto {
    const dto = new ReadOnlyStudyRecordDto();

    dto.study_record_id = study_record.study_record_id;
    dto.start_time = study_record.start_time;
    dto.end_time = study_record.end_time;
    dto.member_id = study_record.member_id;
    dto.status = study_record.status;
    dto.study_category = study_record.study_category
      ? StudyCategoryMapper.toDto(study_record.study_category)
      : null;

    return dto;
  }
}
