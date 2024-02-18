import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyRecordEntity } from '../database/entities/study-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudyRecordEntity])],
  providers: [StatisticsService],
  exports: [StatisticsService],
})
export class StatisticsModule {}
