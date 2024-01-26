import { ReadOnlyStatisticDto } from '../dtos/readonly-statistic.dto';
import { Statistic } from '../entities/statistic.entity';

export class StatisticMapper {
  static toDto(statistic: Statistic): ReadOnlyStatisticDto {
    const dto = new ReadOnlyStatisticDto();

    dto.statistic_id = statistic.statistic_id;
    dto.total_time = statistic.total_time;
    dto.pay_egg_count = statistic.pay_egg_count;

    return dto;
  }
}
