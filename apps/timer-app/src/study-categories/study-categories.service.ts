import { StudyCategory } from '@app/database/typeorm/entities/study-category.entity';
import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import {
  DataSource,
  FindManyOptions,
  FindOneOptions,
  QueryRunner,
  Repository,
} from 'typeorm';
import { CreateStudyCategoryInputDto } from './dtos/create-study-category.dto';
import { UpdateStudyCategoryInputDto } from './dtos/update-study-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StudyRecordsService } from '../study-records/study-records.service';

@Injectable()
export class StudyCategoriesService {
  constructor(
    @InjectRepository(StudyCategory)
    private studyCategoryRepository: Repository<StudyCategory>,
    @Inject(forwardRef(() => StudyRecordsService))
    private studyRecordsService: StudyRecordsService,
    private dataSource: DataSource,
  ) {}

  async findAll(
    options: FindManyOptions<StudyCategory>,
    queryRunner?: QueryRunner,
  ) {
    if (queryRunner) {
      return queryRunner.manager.getRepository(StudyCategory).find(options);
    }
    return this.studyCategoryRepository.find(options);
  }

  async findOne(
    options: FindOneOptions<StudyCategory>,
    queryRunner?: QueryRunner,
  ) {
    if (queryRunner) {
      return queryRunner.manager.getRepository(StudyCategory).findOne(options);
    }
    return this.studyCategoryRepository.findOne(options);
  }

  async delete(study_category_id: number) {
    const result =
      await this.studyCategoryRepository.softDelete(study_category_id);
    return result.affected ? 0 < result.affected : false;
  }

  async create(member_id: string, { subject }: CreateStudyCategoryInputDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const exist = await this.findOne(
        {
          withDeleted: true,
          where: {
            member: { member_id: member_id },
            subject,
          },
        },
        queryRunner,
      );
      if (exist && !exist.deleted_at) {
        throw new BadRequestException('이미 동일한 카테고리가 존재합니다.');
      }
      // 만들어진 이력이 있으면 살려서 반환
      if (exist && exist.deleted_at) {
        await queryRunner.manager.update(
          StudyCategory,
          exist.study_category_id,
          {
            deleted_at: null,
          },
        );
        await queryRunner.commitTransaction();
        exist.deleted_at = null;
        return exist;
      }

      // 없으면 새로 생성
      const newCategory = queryRunner.manager.create(StudyCategory, {
        member: {
          member_id,
        },
        subject,
      });

      await queryRunner.manager.insert(StudyCategory, newCategory);
      await queryRunner.commitTransaction();

      return newCategory;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async update(
    member_id: string,
    study_category_id: number,
    { subject }: UpdateStudyCategoryInputDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingCategory = await this.findOne(
        {
          where: {
            study_category_id,
          },
          relations: {
            study_records: true,
          },
        },
        queryRunner,
      );
      if (!existingCategory) {
        throw new BadRequestException('해당 카테고리가 존재하지 않습니다.');
      }
      if (existingCategory.subject === subject) {
        throw new BadRequestException('변경된 내용이 없습니다.');
      }

      const targetCategory = await this.findOne(
        {
          withDeleted: true,
          where: { member: { member_id }, subject },
        },
        queryRunner,
      );

      // target 기록 존재시 공부기록들의 카테고리를 타겟 카테고리로 수정 후 기존꺼 삭제
      if (targetCategory) {
        await this.mergeCategories(
          existingCategory,
          targetCategory,
          queryRunner,
        );
        return;
      }
      // target 기록 없을시 기존 카테고리의 subject만 업데이트
      await queryRunner.manager.update(
        StudyCategory,
        existingCategory.study_category_id,
        { subject },
      );
      existingCategory.subject = subject;
      return existingCategory;
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  // 기존 카테고리를 제거하고 타겟 카테고리에 공부기록 연결
  private async mergeCategories(
    existingCategory: StudyCategory,
    targetCategory: StudyCategory,
    queryRunner?: QueryRunner,
  ) {
    const repository = queryRunner
      ? queryRunner.manager.getRepository(StudyCategory)
      : this.studyCategoryRepository;

    // 기존 카테고리에 속한 기록의 연결을 끊고 타겟 카테고리와 연결
    const studyRecordIds = existingCategory.study_records.map(
      (record) => record.study_record_id,
    );
    if (0 < studyRecordIds.length) {
      await this.studyRecordsService.updateCategoryOfRecords(
        studyRecordIds,
        targetCategory.study_category_id,
        queryRunner,
      );
    }

    await repository.delete(existingCategory.study_category_id);
    if (targetCategory.deleted_at) {
      await repository.update(targetCategory.study_category_id, {
        deleted_at: null,
      });
      targetCategory.deleted_at = null;
    }

    return targetCategory;
  }
}
