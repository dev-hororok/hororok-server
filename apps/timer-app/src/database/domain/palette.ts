import { StudyStreak } from './study-streak';

export class Palette {
  palette_id: number;
  grade: string;
  name: string;
  light_color: string;
  normal_color: string;
  dark_color: string;
  darker_color: string;
  study_streaks?: StudyStreak[];

  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}
