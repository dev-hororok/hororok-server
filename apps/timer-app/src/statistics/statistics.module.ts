import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyRecord } from '@app/database/typeorm/entities/study-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudyRecord])],
  providers: [StatisticsService],
  exports: [StatisticsService],
})
export class StatisticsModule {}
