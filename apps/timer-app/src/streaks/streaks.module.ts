import { Module } from '@nestjs/common';
import { StreaksService } from './streaks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyStreak } from '@app/database/typeorm/entities/study-streak.entity';
import { TransactionService } from '../common/transaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([StudyStreak])],
  providers: [StreaksService, TransactionService],
  exports: [StreaksService],
})
export class StreaksModule {}
