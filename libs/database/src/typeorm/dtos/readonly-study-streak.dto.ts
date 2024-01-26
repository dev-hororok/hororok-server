import { IsDate, IsNotEmpty, IsNumber, IsObject } from 'class-validator';
import { ReadOnlyPaletteDto } from './readonly-palette.dto';

export class ReadOnlyStudyStreakDto {
  @IsNumber()
  @IsNotEmpty()
  study_streak_id: number;

  @IsNumber()
  @IsNotEmpty()
  current_streak: number;

  @IsNumber()
  @IsNotEmpty()
  longest_streak: number;

  @IsDate()
  @IsNotEmpty()
  created_at: Date;

  @IsDate()
  @IsNotEmpty()
  updated_at: Date;

  @IsObject()
  palette: ReadOnlyPaletteDto | null;
}
