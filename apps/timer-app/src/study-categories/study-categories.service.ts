import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import {
  FindManyOptions,
  FindOneOptions,
  QueryRunner,
  Repository,
} from 'typeorm';
import { CreateStudyCategoryInputDto } from './dtos/create-study-category.dto';
import { UpdateStudyCategoryInputDto } from './dtos/update-study-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StudyRecordsService } from '../study-records/study-records.service';
import { TransactionService } from '../common/transaction.service';
import { StudyCategoryEntity } from '../database/entities/study-category.entity';
import { StudyCategory } from '../database/domain/study-category';

@Injectable()
export class StudyCategoriesService {
  constructor(
    @InjectRepository(StudyCategoryEntity)
    private studyCategoryRepository: Repository<StudyCategoryEntity>,
    @Inject(forwardRef(() => StudyRecordsService))
    private studyRecordsService: StudyRecordsService,

    private transactionService: TransactionService,
  ) {}

  /** queryRunner 여부에 따라 StudyCategory Repository를 생성 */
  private getRepository(
    queryRunner?: QueryRunner,
  ): Repository<StudyCategoryEntity> {
    return queryRunner
      ? queryRunner.manager.getRepository(StudyCategoryEntity)
      : this.studyCategoryRepository;
  }

  async findAll(
    options: FindManyOptions<StudyCategoryEntity>,
    queryRunner?: QueryRunner,
  ) {
    const repository = this.getRepository(queryRunner);
    return repository.find(options);
  }

  async findOne(
    options: FindOneOptions<StudyCategoryEntity>,
    queryRunner?: QueryRunner,
  ) {
    const repository = this.getRepository(queryRunner);
    return repository.findOne(options);
  }

  async softDelete(studyCategoryId: number, queryRunner?: QueryRunner) {
    const repository = this.getRepository(queryRunner);
    const result = await repository.softDelete(studyCategoryId);
    return result.affected ? 0 < result.affected : false;
  }

  async create(memberId: string, { subject }: CreateStudyCategoryInputDto) {
    return this.transactionService.executeInTransaction(async (queryRunner) => {
      const existingCategory = await this.findOneBySubjectAndMemberId(
        subject,
        memberId,
        queryRunner,
      );
      if (existingCategory && !existingCategory.deleted_at) {
        throw new BadRequestException('이미 동일한 카테고리가 존재합니다.');
      }

      // 새 카테고리 생성
      const newCategory = queryRunner.manager.create(StudyCategoryEntity, {
        subject: subject,
        member: { member_id: memberId },
      });
      await queryRunner.manager.insert(StudyCategoryEntity, newCategory);
      return newCategory;
    });
  }

  async update(
    memberId: string,
    studyCategoryId: number,
    { subject }: UpdateStudyCategoryInputDto,
  ): Promise<StudyCategory> {
    return this.transactionService.executeInTransaction(async (queryRunner) => {
      const existingCategory = await this.findOneWithStudyRecordsByIdOrFail(
        studyCategoryId,
        queryRunner,
      );
      if (existingCategory.subject === subject) {
        throw new BadRequestException('변경된 내용이 없습니다.');
      }

      const targetCategory = await this.findOneBySubjectAndMemberId(
        subject,
        memberId,
        queryRunner,
      );

      if (targetCategory) {
        await this.mergeCategories(
          existingCategory,
          targetCategory,
          queryRunner,
        );
        return targetCategory;
      }

      // subject 업데이트
      await queryRunner.manager.update(StudyCategory, studyCategoryId, {
        subject: subject,
      });
      existingCategory.subject = subject;
      return existingCategory;
    });
  }

  /** 기존 카테고리를 제거하고 타겟 카테고리에 공부기록 연결 */
  private async mergeCategories(
    existingCategory: StudyCategory,
    targetCategory: StudyCategory,
    queryRunner?: QueryRunner,
  ) {
    const studyRecordIds = existingCategory.study_records?.map(
      (record) => record.study_record_id,
    );
    if (studyRecordIds && 0 < studyRecordIds.length) {
      await this.studyRecordsService.updateCategoryOfRecords(
        studyRecordIds,
        targetCategory.study_category_id,
        queryRunner,
      );
    }

    await this.softDelete(existingCategory.study_category_id, queryRunner);

    return targetCategory;
  }

  /** StudyCategory를 StudyRecords와 함께 반환 */
  private async findOneWithStudyRecordsById(
    studyCategoryId: number,
    queryRunner?: QueryRunner,
  ): Promise<StudyCategory | null> {
    const repository = this.getRepository(queryRunner);
    return repository.findOne({
      where: {
        study_category_id: studyCategoryId,
      },
      relations: ['study_records'],
    });
  }

  /** StudyCategory를 StudyRecords와 함께 반환 or 없으면 에러 */
  private async findOneWithStudyRecordsByIdOrFail(
    studyCategoryId: number,
    queryRunner?: QueryRunner,
  ): Promise<StudyCategory> {
    const category = await this.findOneWithStudyRecordsById(
      studyCategoryId,
      queryRunner,
    );
    if (!category) {
      throw new NotFoundException('해당 카테고리가 존재하지 않습니다.');
    }
    return category;
  }

  /** softDelete된 카테고리 포함 */
  private async findOneBySubjectAndMemberId(
    subject: string,
    memberId: string,
    queryRunner?: QueryRunner,
  ): Promise<StudyCategory | null> {
    const repository = this.getRepository(queryRunner);
    return repository.findOne({
      where: {
        subject: subject,
        member: { member_id: memberId },
      },
    });
  }
}
