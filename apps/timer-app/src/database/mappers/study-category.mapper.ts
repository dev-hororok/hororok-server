import { StudyCategory } from '../domain/study-category';
import { StudyCategoryEntity } from '../entities/study-category.entity';
import { MemberMapper } from './member.mapper';

export class StudyCategoryMapper {
  static toDomain(raw: StudyCategoryEntity): StudyCategory {
    const studyCategory = new StudyCategory();

    studyCategory.study_category_id = raw.study_category_id;
    studyCategory.subject = raw.subject;
    studyCategory.color = raw.color;

    if (raw.member) {
      studyCategory.member = MemberMapper.toDomain(raw.member);
    }
    if (raw.study_records) {
      studyCategory.study_records = raw.study_records;
    }
    studyCategory.deleted_at = raw.deleted_at;

    return studyCategory;
  }
}
