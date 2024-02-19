import { Module } from '@nestjs/common';
import { StreaksService } from './streaks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionService } from '../common/transaction.service';
import { StudyStreakEntity } from '../database/entities/study-streak.entity';
import { StudyStreakRepository } from './repositories/study-streak.repository.interface';
import { TypeOrmStudyStreakRepository } from './repositories/typeorm/study-streak.repository';

@Module({
  imports: [TypeOrmModule.forFeature([StudyStreakEntity])],
  providers: [
    StreaksService,
    TransactionService,
    {
      provide: StudyStreakRepository,
      useClass: TypeOrmStudyStreakRepository,
    },
  ],
  exports: [StreaksService],
})
export class StreaksModule {}
