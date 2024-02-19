import { Module } from '@nestjs/common';
import { StudyRecordsService } from './study-records.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyRecordEntity } from '../database/entities/study-record.entity';
import { StudyRecordRepository } from './repositories/study-record.repository.interface';
import { TypeOrmStudyRecordRepository } from './repositories/typeorm/study-record.repository';

@Module({
  imports: [TypeOrmModule.forFeature([StudyRecordEntity])],
  providers: [
    StudyRecordsService,
    {
      provide: StudyRecordRepository,
      useClass: TypeOrmStudyRecordRepository,
    },
  ],
  exports: [StudyRecordsService],
})
export class StudyRecordsModule {}
