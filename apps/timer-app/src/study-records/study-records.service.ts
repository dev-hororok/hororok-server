import { StudyRecord } from '@app/database/typeorm/entities/study-record.entity';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  FindOneOptions,
  QueryRunner,
  Repository,
} from 'typeorm';
import { CreateStudyRecordInputDto } from './dtos/create-study-record.dto';
import { StudyCategoriesService } from '../study-categories/study-categories.service';

@Injectable()
export class StudyRecordsService {
  constructor(
    @InjectRepository(StudyRecord)
    private studyRecordRepository: Repository<StudyRecord>,
    @Inject(forwardRef(() => StudyCategoriesService))
    private readonly studyCategoryService: StudyCategoriesService,
  ) {}

  async findAll(
    options?: FindManyOptions<StudyRecord>,
  ): Promise<StudyRecord[]> {
    return this.studyRecordRepository.find(options);
  }

  async findOne(
    options: FindOneOptions<StudyRecord>,
    queryRunner?: QueryRunner,
  ): Promise<StudyRecord | null> {
    if (queryRunner) {
      return queryRunner.manager.findOne(StudyRecord, options);
    }
    return this.studyRecordRepository.findOne(options);
  }

  async create(
    { member_id, category_id }: CreateStudyRecordInputDto,
    queryRunner?: QueryRunner,
  ) {
    const repository = queryRunner
      ? queryRunner.manager.getRepository(StudyRecord)
      : this.studyRecordRepository;

    const category = await this.studyCategoryService.findOne(
      {
        where: { member: { member_id }, study_category_id: category_id },
      },
      queryRunner,
    );

    const newRecord = repository.create({
      member: {
        member_id,
      },
      study_category: category ? category : undefined,
      duration: 0,
    });

    await repository.insert(newRecord);
    return newRecord;
  }

  async update(
    id: number,
    studyRecord: Partial<StudyRecord>,
    queryRunner?: QueryRunner,
  ): Promise<boolean> {
    const repository = queryRunner
      ? queryRunner.manager.getRepository(StudyRecord)
      : this.studyRecordRepository;
    const result = await repository.update(id, studyRecord);
    return result.affected ? 0 < result.affected : false;
  }

  async delete(id: number, queryRunner?: QueryRunner): Promise<boolean> {
    const repository = queryRunner
      ? queryRunner.manager.getRepository(StudyRecord)
      : this.studyRecordRepository;
    const result = await repository.delete(id);

    return result.affected ? 0 < result.affected : false;
  }

  async updateCategoryOfRecords(
    recordIds: number[],
    targetCategoryId: number,
    queryRunner?: QueryRunner,
  ): Promise<void> {
    const queryBuilder = queryRunner
      ? queryRunner.manager.getRepository(StudyRecord).createQueryBuilder()
      : this.studyRecordRepository.createQueryBuilder();

    await queryBuilder
      .update(StudyRecord)
      .set({ study_category: { study_category_id: targetCategoryId } })
      .where('study_record_id In (:...recordIds)', { recordIds })
      .execute();
  }
}
