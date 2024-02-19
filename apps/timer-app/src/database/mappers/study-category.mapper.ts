import { StudyCategory } from '../domain/study-category';
import { MemberEntity } from '../entities/member.entity';
import { StudyCategoryEntity } from '../entities/study-category.entity';
import { StudyRecordEntity } from '../entities/study-record.entity';
import { MemberMapper } from './member.mapper';
import { StudyRecordMapper } from './study-record.mapper';

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

  static toPersistence(studyCategory: StudyCategory): StudyCategoryEntity {
    let member: MemberEntity | undefined = undefined;

    if (studyCategory.member) {
      member = new MemberEntity();
      member.member_id = studyCategory.member.member_id;
    }
    const studyRecords: StudyRecordEntity[] | undefined =
      studyCategory.study_records
        ? studyCategory.study_records.map((n) =>
            StudyRecordMapper.toPersistence(n),
          )
        : undefined;

    const studyCategoryEntity = new StudyCategoryEntity();

    studyCategoryEntity.study_category_id = studyCategory.study_category_id;
    studyCategoryEntity.subject = studyCategory.subject;
    studyCategoryEntity.color = studyCategory.color;

    studyCategoryEntity.member = member;
    studyCategoryEntity.study_records = studyRecords;

    studyCategoryEntity.deleted_at = studyCategory.deleted_at;

    return studyCategoryEntity;
  }
}
