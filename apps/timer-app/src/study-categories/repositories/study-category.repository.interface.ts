import { QueryRunner } from 'typeorm';
import { NullableType } from '../../utils/types/nullable.type';
import { Member } from '../../database/domain/member';
import { StudyCategory } from '../../database/domain/study-category';

export abstract class StudyCategoryRepository {
  abstract getMemberCategories(
    memberId: Member['member_id'],
    queryRunner?: QueryRunner,
  ): Promise<StudyCategory[]>;

  abstract create(
    memberId: Member['member_id'],
    payload: Pick<StudyCategory, 'subject'>,
    queryRunner?: QueryRunner,
  ): Promise<StudyCategory>;

  abstract update(
    id: StudyCategory['study_category_id'],
    payload: Partial<StudyCategory>,
    queryRunner?: QueryRunner,
  ): Promise<NullableType<StudyCategory>>;

  abstract softDelete(
    id: StudyCategory['study_category_id'],
    queryRunner?: QueryRunner,
  ): Promise<void>;

  abstract findOneBySubjectAndMemberId(
    memberId: Member['member_id'],
    subject: StudyCategory['subject'],
    queryRunner?: QueryRunner,
  ): Promise<NullableType<StudyCategory>>;

  abstract findOneWithStudyRecordsById(
    id: StudyCategory['study_category_id'],
    queryRunner?: QueryRunner,
  ): Promise<NullableType<StudyCategory>>;
}
