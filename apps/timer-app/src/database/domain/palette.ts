import { Expose } from 'class-transformer';
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

  @Expose({ groups: ['admin'] })
  created_at: Date;
  @Expose({ groups: ['admin'] })
  updated_at: Date;
  @Expose({ groups: ['admin'] })
  deleted_at: Date;
}
