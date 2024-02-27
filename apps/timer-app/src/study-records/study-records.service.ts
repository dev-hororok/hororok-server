import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { CreateStudyRecordInputDto } from './dtos/create-study-record.dto';
import { StudyRecordEntity } from '../database/entities/study-record.entity';
import { StudyRecordRepository } from './repositories/study-record.repository.interface';
import { EntityCondition } from '../utils/types/entity-condition.type';
import { StudyRecord } from '../database/domain/study-record';
import { NullableType } from '../utils/types/nullable.type';
import { Member } from '../database/domain/member';
import { StudyCategory } from '../database/domain/study-category';
import { STATUS_MESSAGES } from '../utils/constants';

@Injectable()
export class StudyRecordsService {
  constructor(private readonly studyRecordRepository: StudyRecordRepository) {}

  async findOne(
    fields: EntityCondition<StudyRecord>,
    queryRunner?: QueryRunner,
  ): Promise<StudyRecordEntity | null> {
    return this.studyRecordRepository.findOne(fields, queryRunner);
  }

  async findActiveRecordOrFail(
    activeRecordId: Member['active_record_id'],
    queryRunner?: QueryRunner,
  ): Promise<StudyRecordEntity> {
    if (activeRecordId === null) {
      throw new NotFoundException(
        STATUS_MESSAGES.RESOURCE.RESOURCE_NOT_FOUND('진행중인 타이머'),
      );
    }
    const record = await this.findOne(
      { study_record_id: activeRecordId },
      queryRunner,
    );

    if (!record) {
      throw new NotFoundException(
        STATUS_MESSAGES.RESOURCE.RESOURCE_NOT_FOUND('진행중인 타이머'),
      );
    }

    return record;
  }

  async create(data: CreateStudyRecordInputDto, queryRunner?: QueryRunner) {
    return this.studyRecordRepository.create(data, queryRunner);
  }

  async update(
    id: StudyRecord['study_record_id'],
    payload: Partial<StudyRecord>,
    queryRunner?: QueryRunner,
  ): Promise<NullableType<StudyRecord>> {
    return this.studyRecordRepository.update(id, payload, queryRunner);
  }

  async softDelete(
    id: StudyRecord['study_record_id'],
    queryRunner?: QueryRunner,
  ): Promise<void> {
    return this.studyRecordRepository.softDelete(id, queryRunner);
  }

  /** 주어진 RecordIds에 연결된 카테고리를 targetCategoryId로 모두 업데이트 */
  async updateCategoryOfRecords(
    recordIds: StudyRecord['study_record_id'][],
    targetCategoryId: StudyCategory['study_category_id'],
    queryRunner?: QueryRunner,
  ): Promise<void> {
    return this.studyRecordRepository.updateCategoryOfRecords(
      recordIds,
      targetCategoryId,
      queryRunner,
    );
  }

  /** 레코드의 status를 업데이트 시켜줌 (status : "Completed" | "Incompleted") */
  async completeStudyRecord(
    studyRecordId: StudyRecord['study_record_id'],
    status: string,
    queryRunner?: QueryRunner,
  ): Promise<NullableType<StudyRecord>> {
    return this.studyRecordRepository.update(
      studyRecordId,
      {
        status,
        end_time: new Date(),
      },
      queryRunner,
    );
  }
}
