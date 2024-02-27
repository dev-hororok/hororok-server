import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { NullableType } from 'apps/timer-app/src/utils/types/nullable.type';
import { Member } from 'apps/timer-app/src/database/domain/member';
import { StudyCategory } from 'apps/timer-app/src/database/domain/study-category';
import { StudyCategoryRepository } from '../study-category.repository.interface';
import { StudyCategoryEntity } from 'apps/timer-app/src/database/entities/study-category.entity';
import { StudyCategoryMapper } from 'apps/timer-app/src/database/mappers/study-category.mapper';
import { STATUS_MESSAGES } from 'apps/timer-app/src/utils/constants';

@Injectable()
export class TypeOrmStudyCategoryRepository implements StudyCategoryRepository {
  constructor(
    @InjectRepository(StudyCategoryEntity)
    private studyCategoryRepository: Repository<StudyCategoryEntity>,
  ) {}

  /** queryRunner 여부에 따라 studyCategory Repository를 생성 */
  private getRepository(
    queryRunner?: QueryRunner,
  ): Repository<StudyCategoryEntity> {
    return queryRunner
      ? queryRunner.manager.getRepository(StudyCategoryEntity)
      : this.studyCategoryRepository;
  }

  async getMemberCategories(
    memberId: Member['member_id'],
    queryRunner?: QueryRunner,
  ): Promise<StudyCategory[]> {
    const repository = this.getRepository(queryRunner);

    const entities = await repository.find({
      where: {
        member: { member_id: memberId },
      },
    });

    return entities.map((n) => StudyCategoryMapper.toDomain(n));
  }

  async create(
    memberId: Member['member_id'],
    payload: Pick<StudyCategory, 'subject'>,
    queryRunner?: QueryRunner,
  ): Promise<StudyCategory> {
    const repository = this.getRepository(queryRunner);
    const newEntity = await repository.save(
      repository.create({
        member: {
          member_id: memberId,
        },
        subject: payload.subject,
      }),
    );
    return StudyCategoryMapper.toDomain(newEntity);
  }

  async update(
    id: StudyCategory['study_category_id'],
    payload: Partial<StudyCategory>,
    queryRunner?: QueryRunner,
  ): Promise<NullableType<StudyCategory>> {
    const repository = this.getRepository(queryRunner);
    const entity = await repository.findOne({
      where: { study_category_id: id },
    });

    if (!entity) {
      throw new NotFoundException(
        STATUS_MESSAGES.RESOURCE.RESOURCE_NOT_FOUND('카테고리'),
      );
    }

    const updatedEntity = await repository.save(
      repository.create(
        StudyCategoryMapper.toPersistence({
          ...StudyCategoryMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return StudyCategoryMapper.toDomain(updatedEntity);
  }

  async softDelete(
    id: StudyCategory['study_category_id'],
    queryRunner?: QueryRunner,
  ): Promise<void> {
    const repository = this.getRepository(queryRunner);
    await repository.softDelete(id);
  }

  async findOneWithStudyRecordsById(
    id: StudyCategory['study_category_id'],
    queryRunner?: QueryRunner | undefined,
  ): Promise<NullableType<StudyCategory>> {
    const repository = this.getRepository(queryRunner);
    const entity = await repository.findOne({
      where: {
        study_category_id: id,
      },
      relations: { study_records: true },
    });

    return entity ? StudyCategoryMapper.toDomain(entity) : null;
  }

  async findOneBySubjectAndMemberId(
    memberId: Member['member_id'],
    subject: StudyCategory['subject'],
    queryRunner?: QueryRunner | undefined,
  ): Promise<NullableType<StudyCategory>> {
    const repository = this.getRepository(queryRunner);
    const entity = await repository.findOne({
      where: {
        member: { member_id: memberId },
        subject,
      },
    });

    return entity ? StudyCategoryMapper.toDomain(entity) : null;
  }
}
