import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, QueryRunner, Repository } from 'typeorm';
import { NullableType } from 'apps/timer-app/src/utils/types/nullable.type';
import { StudyRecordRepository } from '../study-record.repository.interface';
import { StudyRecordEntity } from 'apps/timer-app/src/database/entities/study-record.entity';
import { StudyRecord } from 'apps/timer-app/src/database/domain/study-record';
import { EntityCondition } from 'apps/timer-app/src/utils/types/entity-condition.type';
import { StudyRecordMapper } from 'apps/timer-app/src/database/mappers/study-record.mapper';
import { CreateStudyRecordInputDto } from '../../dtos/create-study-record.dto';

@Injectable()
export class TypeOrmStudyRecordRepository implements StudyRecordRepository {
  constructor(
    @InjectRepository(StudyRecordEntity)
    private studyRecordsRepository: Repository<StudyRecordEntity>,
  ) {}

  /** queryRunner 여부에 따라 studyStreak Repository를 생성 */
  private getRepository(
    queryRunner?: QueryRunner,
  ): Repository<StudyRecordEntity> {
    return queryRunner
      ? queryRunner.manager.getRepository(StudyRecordEntity)
      : this.studyRecordsRepository;
  }

  async findOne(
    fields: EntityCondition<StudyRecord>,
    queryRunner?: QueryRunner,
  ): Promise<NullableType<StudyRecord>> {
    const repository = this.getRepository(queryRunner);
    const entity = await repository.findOne({
      where: fields as FindOptionsWhere<StudyRecordEntity>,
    });
    return entity ? StudyRecordMapper.toDomain(entity) : null;
  }

  async softDelete(
    studyRecordId: StudyRecord['study_record_id'],
    queryRunner?: QueryRunner,
  ): Promise<void> {
    const repository = this.getRepository(queryRunner);
    await repository.softDelete(studyRecordId);
  }

  async create(
    data: CreateStudyRecordInputDto,
    queryRunner?: QueryRunner,
  ): Promise<StudyRecord> {
    const repository = this.getRepository(queryRunner);
    const newEntity = await repository.save(
      repository.create({
        start_time: data.start_time,
        member: {
          member_id: data.member_id,
        },
        study_category: data.category_id
          ? {
              study_category_id: data.category_id,
            }
          : undefined,
      }),
    );

    return StudyRecordMapper.toDomain(newEntity);
  }

  async update(
    id: StudyRecord['study_record_id'],
    payload: Partial<StudyRecord>,
    queryRunner?: QueryRunner,
  ): Promise<NullableType<StudyRecord>> {
    const repository = this.getRepository(queryRunner);
    const entity = await repository.findOne({
      where: { study_record_id: id },
    });

    if (!entity) {
      throw new NotFoundException('기록을 찾을 수 없습니다.');
    }

    const updatedEntity = await repository.save(
      repository.create(
        StudyRecordMapper.toPersistence({
          ...StudyRecordMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return StudyRecordMapper.toDomain(updatedEntity);
  }

  async updateCategoryOfRecords(
    recordIds: number[],
    targetCategoryId: number,
    queryRunner?: QueryRunner,
  ): Promise<void> {
    const repository = this.getRepository(queryRunner);

    await repository
      .createQueryBuilder()
      .update(StudyRecordEntity)
      .set({ study_category: { study_category_id: targetCategoryId } })
      .where('study_record_id IN (:...recordIds)', { recordIds })
      .execute();
  }
}
