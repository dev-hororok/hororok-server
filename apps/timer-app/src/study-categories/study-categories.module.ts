import { Module, forwardRef } from '@nestjs/common';
import { StudyCategoriesService } from './study-categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyRecordsModule } from '../study-records/study-records.module';
import { TransactionService } from '../common/transaction.service';
import { StudyCategory } from '../database/entities/study-category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudyCategory]),
    forwardRef(() => StudyRecordsModule),
  ],
  providers: [StudyCategoriesService, TransactionService],
  exports: [StudyCategoriesService],
})
export class StudyCategoriesModule {}
