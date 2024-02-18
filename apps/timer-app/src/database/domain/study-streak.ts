import { Member } from './member';
import { Palette } from './palette';

export class StudyStreak {
  study_streak_id: number;
  current_streak: number;
  longest_streak: number;
  member?: Member;
  palette?: Palette;

  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}
