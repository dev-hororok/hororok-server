import { IsIn, IsNumber, IsString } from 'class-validator';

export class PushPomodoroDto {
  @IsString()
  @IsIn(['Work', 'Rest'])
  timerType: string;

  @IsNumber()
  targetSeconds: number;
}
