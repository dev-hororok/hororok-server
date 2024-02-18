import { StudyStreak } from '../domain/study-streak';
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
}
