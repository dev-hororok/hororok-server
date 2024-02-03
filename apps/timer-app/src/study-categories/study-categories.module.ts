import { Module, forwardRef } from '@nestjs/common';
import { StudyCategoriesService } from './study-categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyCategory } from '@app/database/typeorm/entities/study-category.entity';
import { StudyRecordsModule } from '../study-records/study-records.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudyCategory]),
    forwardRef(() => StudyRecordsModule),
  ],
  providers: [StudyCategoriesService],
  exports: [StudyCategoriesService],
})
export class StudyCategoriesModule {}
