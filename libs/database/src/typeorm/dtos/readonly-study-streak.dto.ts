import { IsNotEmpty, IsNumber } from 'class-validator';

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
}
