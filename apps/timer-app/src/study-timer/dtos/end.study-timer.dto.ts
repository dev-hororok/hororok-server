import { IsString } from 'class-validator';

export class EndStudyTimerInputDto {
  @IsString()
  status: string;
}
