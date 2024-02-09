import { StudyRecord } from '@app/database/typeorm/entities/study-record.entity';
import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
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
  async findActiveRecordOrFail(
    activeRecordId: number | null,
    queryRunner?: QueryRunner,
  ): Promise<StudyRecord> {
    if (activeRecordId === null) {
      throw new NotFoundException('진행중인 타이머가 없습니다.');
    }
    const queryBuilder = queryRunner
      ? queryRunner.manager.getRepository(StudyRecord)
      : this.studyRecordRepository;

    const record = await queryBuilder.findOne({
      where: { study_record_id: activeRecordId },
    });

    if (!record) {
      throw new NotFoundException('진행중인 타이머가 없습니다.');
    }

    return record;
  }

  async create(
    { start_time, member_id, category_id }: CreateStudyRecordInputDto,
    queryRunner?: QueryRunner,
  ) {
    const repository = queryRunner
      ? queryRunner.manager.getRepository(StudyRecord)
      : this.studyRecordRepository;

    const category = await this.studyCategoryService.findOne(
      {
        select: ['study_category_id'],
        where: {
          member: { member_id: member_id },
          study_category_id: category_id,
        },
      },
      queryRunner,
    );
    const newRecord = repository.create({
      start_time: start_time,
      study_category: category ? category : undefined,
      member: {
        member_id,
      },
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
    const result = await repository.softDelete(id);
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

  /** 레코드의 status를 업데이트 시켜줌 (status : "Completed" | "Incompleted") */
  async completeStudyRecord(
    studyRecordId: number,
    status: string,
    queryRunner?: QueryRunner,
  ): Promise<void> {
    const repository = queryRunner
      ? queryRunner.manager.getRepository(StudyRecord)
      : this.studyRecordRepository;
    await repository.update(studyRecordId, {
      status: status,
      end_time: new Date(),
    });
  }
}
