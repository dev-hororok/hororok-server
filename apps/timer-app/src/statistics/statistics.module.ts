import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsProviders } from './statistics.providers';
import { DatabaseModule } from '@app/database';

@Module({
  imports: [DatabaseModule],
  providers: [...StatisticsProviders, StatisticsService],
  exports: [StatisticsService],
})
export class StatisticsModule {}
