import { IsNumber, IsString } from 'class-validator';

export class PushPomodoroDto {
  @IsString()
  timerType: string;

  @IsNumber()
  targetSeconds: number;
}
