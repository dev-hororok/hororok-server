import { Module } from '@nestjs/common';
import { StudyCategoriesService } from './study-categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyCategory } from '@app/database/typeorm/entities/study-category.entity';
import { StudyRecord } from '@app/database/typeorm/entities/study-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudyCategory, StudyRecord])],
  providers: [StudyCategoriesService],
  exports: [StudyCategoriesService],
})
export class StudyCategoriesModule {}
