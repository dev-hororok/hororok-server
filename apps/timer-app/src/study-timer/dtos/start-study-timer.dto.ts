import { IsNumber, IsOptional } from 'class-validator';

export class StartStudyTimerInputDto {
  @IsNumber()
  @IsOptional()
  category_id?: number;
}
