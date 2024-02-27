import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { CreateStudyCategoryInputDto } from './dtos/create-study-category.dto';
import { UpdateStudyCategoryInputDto } from './dtos/update-study-category.dto';
import { StudyRecordsService } from '../study-records/study-records.service';
import { TransactionService } from '../common/transaction.service';
import { StudyCategoryEntity } from '../database/entities/study-category.entity';
import { StudyCategory } from '../database/domain/study-category';
import { StudyCategoryRepository } from './repositories/study-category.repository.interface';
import { Member } from '../database/domain/member';
import { STATUS_MESSAGES } from '../utils/constants';

@Injectable()
export class StudyCategoriesService {
  constructor(
    private readonly studyCategoryRepository: StudyCategoryRepository,
    @Inject(forwardRef(() => StudyRecordsService))
    private studyRecordsService: StudyRecordsService,

    private transactionService: TransactionService,
  ) {}

  async getMemberCategories(
    memberId: Member['member_id'],
    queryRunner?: QueryRunner,
  ): Promise<StudyCategory[]> {
    return this.studyCategoryRepository.getMemberCategories(
      memberId,
      queryRunner,
    );
  }

  async softDelete(
    studyCategoryId: StudyCategory['study_category_id'],
    queryRunner?: QueryRunner,
  ) {
    return this.studyCategoryRepository.softDelete(
      studyCategoryId,
      queryRunner,
    );
  }

  async create(memberId: string, { subject }: CreateStudyCategoryInputDto) {
    return this.transactionService.executeInTransaction(async (queryRunner) => {
      const existingCategory =
        await this.studyCategoryRepository.findOneBySubjectAndMemberId(
          memberId,
          subject,
          queryRunner,
        );
      if (existingCategory && !existingCategory.deleted_at) {
        throw new BadRequestException(
          STATUS_MESSAGES.RESOURCE.RESOURCE_ALREADY_EXISTS('카테고리'),
        );
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
        throw new BadRequestException(STATUS_MESSAGES.VALIDATION.NO_CONTENT);
      }

      const targetCategory =
        await this.studyCategoryRepository.findOneBySubjectAndMemberId(
          memberId,
          subject,
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

  /** StudyCategory를 StudyRecords와 함께 반환 or 없으면 에러 */
  private async findOneWithStudyRecordsByIdOrFail(
    studyCategoryId: StudyCategory['study_category_id'],
    queryRunner?: QueryRunner,
  ): Promise<StudyCategory> {
    const category =
      await this.studyCategoryRepository.findOneWithStudyRecordsById(
        studyCategoryId,
        queryRunner,
      );
    if (!category) {
      throw new NotFoundException(
        STATUS_MESSAGES.RESOURCE.RESOURCE_NOT_FOUND('카테고리'),
      );
    }
    return category;
  }
}
