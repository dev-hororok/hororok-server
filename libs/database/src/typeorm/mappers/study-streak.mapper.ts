import { ReadOnlyStudyStreakDto } from '../dtos/readonly-study-streak.dto';
import { StudyStreak } from '../entities/study-streak.entity';
import { PaletteMapper } from './palette.mapper';

export class StudyStreakMapper {
  static toDto(streak: StudyStreak): ReadOnlyStudyStreakDto {
    const dto = new ReadOnlyStudyStreakDto();

    dto.study_streak_id = streak.study_streak_id;
    dto.longest_streak = streak.longest_streak;
    dto.current_streak = streak.current_streak;
    dto.created_at = streak.created_at;
    dto.updated_at = streak.updated_at;
    dto.palette = streak.palette ? PaletteMapper.toDto(streak.palette) : null;

    return dto;
  }
}
