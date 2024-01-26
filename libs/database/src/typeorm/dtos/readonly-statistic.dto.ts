import { IsNotEmpty, IsNumber } from 'class-validator';

export class ReadOnlyStatisticDto {
  @IsNumber()
  @IsNotEmpty()
  statistic_id: number;

  @IsNumber()
  @IsNotEmpty()
  total_time: number;

  @IsNumber()
  @IsNotEmpty()
  pay_egg_count: number;
}
