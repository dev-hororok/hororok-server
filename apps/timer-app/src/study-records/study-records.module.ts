import { Module } from '@nestjs/common';
import { StudyRecordsService } from './study-records.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyRecord } from '../database/entities/study-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudyRecord])],
  providers: [StudyRecordsService],
  exports: [StudyRecordsService],
})
export class StudyRecordsModule {}
