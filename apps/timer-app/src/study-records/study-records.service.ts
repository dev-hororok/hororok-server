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

  /** queryRunner 여부에 따라 StudyRecord Repository를 생성 */
  private getRepository(queryRunner?: QueryRunner): Repository<StudyRecord> {
    return queryRunner
      ? queryRunner.manager.getRepository(StudyRecord)
      : this.studyRecordRepository;
  }

  async findAll(
    options?: FindManyOptions<StudyRecord>,
    queryRunner?: QueryRunner,
  ): Promise<StudyRecord[]> {
    const repository = this.getRepository(queryRunner);
    return repository.find(options);
  }

  async findOne(
    options: FindOneOptions<StudyRecord>,
    queryRunner?: QueryRunner,
  ): Promise<StudyRecord | null> {
    const repository = this.getRepository(queryRunner);
    return repository.findOne(options);
  }

  async findActiveRecordOrFail(
    activeRecordId: number | null,
    queryRunner?: QueryRunner,
  ): Promise<StudyRecord> {
    if (activeRecordId === null) {
      throw new NotFoundException('진행중인 타이머가 없습니다.');
    }
    const repository = this.getRepository(queryRunner);
    const record = await repository.findOne({
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
    const repository = this.getRepository(queryRunner);

    const newRecord = repository.create({
      start_time: start_time,
      study_category: {
        study_category_id: category_id,
      },
      member: { member_id },
    });

    await repository.insert(newRecord);
    return newRecord;
  }

  async update(
    id: number,
    studyRecord: Partial<StudyRecord>,
    queryRunner?: QueryRunner,
  ): Promise<boolean> {
    const repository = this.getRepository(queryRunner);
    const result = await repository.update(id, studyRecord);
    return result.affected ? 0 < result.affected : false;
  }

  async delete(id: number, queryRunner?: QueryRunner): Promise<boolean> {
    const repository = this.getRepository(queryRunner);
    const result = await repository.softDelete(id);
    return result.affected ? 0 < result.affected : false;
  }

  /** 주어진 RecordIds에 연결된 카테고리를 targetCategoryId로 모두 업데이트 */
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
