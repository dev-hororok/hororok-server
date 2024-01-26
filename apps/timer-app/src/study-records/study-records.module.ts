import { StudyRecordsProviders } from './study-records.providers';
import { Module } from '@nestjs/common';
import { StudyRecordsService } from './study-records.service';
import { DatabaseModule } from '@app/database';

@Module({
  imports: [DatabaseModule],
  providers: [...StudyRecordsProviders, StudyRecordsService],
  exports: [StudyRecordsService],
})
export class StudyRecordsModule {}
