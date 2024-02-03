import { ReadOnlyStudyRecordDto } from '../dtos/readonly-study-record.dto';
import { StudyRecord } from '../entities/study-record.entity';
import { StudyCategoryMapper } from './study-category.mapper';

export class StudyRecordMapper {
  static toDto(study_record: StudyRecord): ReadOnlyStudyRecordDto {
    const dto = new ReadOnlyStudyRecordDto();

    dto.study_record_id = study_record.study_record_id;
    dto.duration = study_record.duration;
    dto.created_at = study_record.created_at;
    dto.study_category = study_record.study_category
      ? StudyCategoryMapper.toDto(study_record.study_category)
      : null;

    return dto;
  }
}
