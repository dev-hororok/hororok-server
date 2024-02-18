import { Expose } from 'class-transformer';
import { Member } from './member';
import { Palette } from './palette';

export class StudyStreak {
  study_streak_id: number;
  current_streak: number;
  longest_streak: number;
  member?: Member;
  palette?: Palette;

  @Expose({ groups: ['admin'] })
  created_at: Date;
  @Expose({ groups: ['admin'] })
  updated_at: Date;
  @Expose({ groups: ['admin'] })
  deleted_at: Date;
}
