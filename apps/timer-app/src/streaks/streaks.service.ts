import { Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { TransactionService } from '../common/transaction.service';
import { StudyStreak } from '../database/domain/study-streak';
import { StudyStreakRepository } from './repositories/study-streak.repository.interface';
import { Member } from '../database/domain/member';
import { NullableType } from '../utils/types/nullable.type';

@Injectable()
export class StreaksService {
  constructor(
    private readonly studyStreakRepository: StudyStreakRepository,
    private readonly transactionService: TransactionService,
  ) {}

  async findOneWithPaletteByMemberId(
    memberId: Member['member_id'],
    queryRunner?: QueryRunner,
  ) {
    return this.studyStreakRepository.findOneWithPaletteByMemberId(
      memberId,
      queryRunner,
    );
  }

  async create(
    memberId: Member['member_id'],
    queryRunner?: QueryRunner,
  ): Promise<StudyStreak> {
    return this.studyStreakRepository.create(memberId, queryRunner);
  }

  async update(
    id: StudyStreak['study_streak_id'],
    payload: Partial<StudyStreak>,
    queryRunner?: QueryRunner,
  ): Promise<NullableType<StudyStreak>> {
    return this.studyStreakRepository.update(id, payload, queryRunner);
  }

  async findOrCreate(memberId: string): Promise<StudyStreak> {
    return this.transactionService.executeInTransaction(async (queryRunner) => {
      let streak = await this.findOneWithPaletteByMemberId(
        memberId,
        queryRunner,
      );
      if (!streak) {
        streak = await this.create(memberId, queryRunner);
      }

      return streak;
    });
  }
}
