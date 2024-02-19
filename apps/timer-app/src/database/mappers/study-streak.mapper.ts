import { StudyStreak } from '../domain/study-streak';
import { MemberEntity } from '../entities/member.entity';
import { PaletteEntity } from '../entities/palette.entity';
import { StudyStreakEntity } from '../entities/study-streak.entity';
import { MemberMapper } from './member.mapper';
import { PaletteMapper } from './palette.mapper';

export class StudyStreakMapper {
  static toDomain(raw: StudyStreakEntity): StudyStreak {
    const studyStreak = new StudyStreak();

    studyStreak.study_streak_id = raw.study_streak_id;
    studyStreak.longest_streak = raw.longest_streak;
    studyStreak.current_streak = raw.current_streak;
    studyStreak.created_at = raw.created_at;
    studyStreak.updated_at = raw.updated_at;

    if (raw.member) {
      studyStreak.member = MemberMapper.toDomain(raw.member);
    }
    if (raw.palette) {
      studyStreak.palette = PaletteMapper.toDomain(raw.palette);
    }
    studyStreak.created_at = raw.created_at;
    studyStreak.updated_at = raw.updated_at;
    studyStreak.deleted_at = raw.deleted_at;
    return studyStreak;
  }

  static toPersistence(studyStreak: StudyStreak): StudyStreakEntity {
    let member: MemberEntity | undefined = undefined;

    if (studyStreak.member) {
      member = new MemberEntity();
      member.member_id = studyStreak.member.member_id;
    }

    let palette: PaletteEntity | undefined = undefined;

    if (studyStreak.palette) {
      palette = new PaletteEntity();
      palette.palette_id = studyStreak.palette.palette_id;
    }

    const studyStreakEntity = new StudyStreakEntity();

    studyStreakEntity.study_streak_id = studyStreak.study_streak_id;
    studyStreakEntity.longest_streak = studyStreak.longest_streak;
    studyStreakEntity.current_streak = studyStreak.current_streak;
    studyStreakEntity.created_at = studyStreak.created_at;
    studyStreakEntity.updated_at = studyStreak.updated_at;

    studyStreakEntity.member = member;
    studyStreakEntity.palette = palette;

    studyStreakEntity.created_at = studyStreak.created_at;
    studyStreakEntity.updated_at = studyStreak.updated_at;
    studyStreakEntity.deleted_at = studyStreak.deleted_at;
    return studyStreakEntity;
  }
}
