import { QueryRunner } from 'typeorm';
import { StudyStreak } from '../../database/domain/study-streak';
import { NullableType } from '../../utils/types/nullable.type';
import { Member } from '../../database/domain/member';

export abstract class StudyStreakRepository {
  abstract findOneWithPaletteByMemberId(
    memberId: Member['member_id'],
    queryRunner?: QueryRunner,
  ): Promise<NullableType<StudyStreak>>;

  abstract create(
    memberId: Member['member_id'],
    queryRunner?: QueryRunner,
  ): Promise<StudyStreak>;

  abstract update(
    id: StudyStreak['study_streak_id'],
    payload: Partial<StudyStreak>,
    queryRunner?: QueryRunner,
  ): Promise<NullableType<StudyStreak>>;
}
