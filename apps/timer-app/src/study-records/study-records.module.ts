import { Module } from '@nestjs/common';
import { StudyRecordsService } from './study-records.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyRecordEntity } from '../database/entities/study-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudyRecordEntity])],
  providers: [StudyRecordsService],
  exports: [StudyRecordsService],
})
export class StudyRecordsModule {}
