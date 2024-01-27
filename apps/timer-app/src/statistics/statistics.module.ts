import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Statistic } from '@app/database/typeorm/entities/statistic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Statistic])],
  providers: [StatisticsService],
  exports: [StatisticsService],
})
export class StatisticsModule {}
