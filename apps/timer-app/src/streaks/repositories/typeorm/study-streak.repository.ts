import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { StudyStreakRepository } from '../study-streak.repository.interface';
import { StudyStreakEntity } from 'apps/timer-app/src/database/entities/study-streak.entity';
import { StudyStreak } from 'apps/timer-app/src/database/domain/study-streak';
import { StudyStreakMapper } from 'apps/timer-app/src/database/mappers/study-streak.mapper';
import { NullableType } from 'apps/timer-app/src/utils/types/nullable.type';
import { Member } from 'apps/timer-app/src/database/domain/member';
import { STATUS_MESSAGES } from 'apps/timer-app/src/utils/constants';

@Injectable()
export class TypeOrmStudyStreakRepository implements StudyStreakRepository {
  constructor(
    @InjectRepository(StudyStreakEntity)
    private studyStreaksRepository: Repository<StudyStreakEntity>,
  ) {}

  /** queryRunner 여부에 따라 studyStreak Repository를 생성 */
  private getRepository(
    queryRunner?: QueryRunner,
  ): Repository<StudyStreakEntity> {
    return queryRunner
      ? queryRunner.manager.getRepository(StudyStreakEntity)
      : this.studyStreaksRepository;
  }

  async findOneWithPaletteByMemberId(
    memberId: Member['member_id'],
    queryRunner?: QueryRunner,
  ): Promise<NullableType<StudyStreak>> {
    const repository = this.getRepository(queryRunner);

    const entity = await repository.findOne({
      where: {
        member: { member_id: memberId },
      },
      relations: ['palette'],
    });

    return entity ? StudyStreakMapper.toDomain(entity) : null;
  }

  async create(
    memberId: Member['member_id'],
    queryRunner?: QueryRunner,
  ): Promise<StudyStreak> {
    const repository = this.getRepository(queryRunner);
    const newEntity = await repository.save(
      repository.create({
        member: {
          member_id: memberId,
        },
        current_streak: 0,
        longest_streak: 0,
      }),
    );
    return StudyStreakMapper.toDomain(newEntity);
  }

  async update(
    studyStreakId: StudyStreak['study_streak_id'],
    payload: Partial<StudyStreak>,
    queryRunner?: QueryRunner,
  ): Promise<NullableType<StudyStreak>> {
    const repository = this.getRepository(queryRunner);
    const entity = await repository.findOne({
      where: { study_streak_id: studyStreakId },
    });

    if (!entity) {
      throw new NotFoundException(STATUS_MESSAGES.RESOURCE.RESOURCE_NOT_FOUND);
    }

    const updatedEntity = await repository.save(
      repository.create(
        StudyStreakMapper.toPersistence({
          ...StudyStreakMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return StudyStreakMapper.toDomain(updatedEntity);
  }
}
