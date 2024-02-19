import { QueryRunner } from 'typeorm';
import { NullableType } from '../../utils/types/nullable.type';
import { StudyRecord } from '../../database/domain/study-record';
import { EntityCondition } from '../../utils/types/entity-condition.type';
import { CreateStudyRecordInputDto } from '../dtos/create-study-record.dto';
import { StudyCategory } from '../../database/domain/study-category';

export abstract class StudyRecordRepository {
  abstract findOne(
    fields: EntityCondition<StudyRecord>,
    QueryRunner?: QueryRunner,
  ): Promise<NullableType<StudyRecord>>;

  abstract softDelete(
    id: StudyRecord['study_record_id'],
    QueryRunner?: QueryRunner,
  ): Promise<void>;

  abstract create(
    data: CreateStudyRecordInputDto,
    queryRunner?: QueryRunner,
  ): Promise<StudyRecord>;

  abstract update(
    id: StudyRecord['study_record_id'],
    payload: Partial<StudyRecord>,
    queryRunner?: QueryRunner,
  ): Promise<NullableType<StudyRecord>>;

  abstract updateCategoryOfRecords(
    recordIds: StudyRecord['study_record_id'][],
    targetCategoryId: StudyCategory['study_category_id'],
    queryRunner?: QueryRunner,
  ): Promise<void>;
}
