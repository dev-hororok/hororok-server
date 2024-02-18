import { Module } from '@nestjs/common';
import { StreaksService } from './streaks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionService } from '../common/transaction.service';
import { StudyStreakEntity } from '../database/entities/study-streak.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudyStreakEntity])],
  providers: [StreaksService, TransactionService],
  exports: [StreaksService],
})
export class StreaksModule {}
