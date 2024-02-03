import { Module, forwardRef } from '@nestjs/common';
import { StudyRecordsService } from './study-records.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyRecord } from '@app/database/typeorm/entities/study-record.entity';
import { StudyCategoriesModule } from '../study-categories/study-categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudyRecord]),
    forwardRef(() => StudyCategoriesModule),
  ],
  providers: [StudyRecordsService],
  exports: [StudyRecordsService],
})
export class StudyRecordsModule {}
