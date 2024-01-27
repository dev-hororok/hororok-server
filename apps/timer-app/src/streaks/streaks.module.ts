import { Module } from '@nestjs/common';
import { StreaksService } from './streaks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyStreak } from '@app/database/typeorm/entities/study-streak.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudyStreak])],
  providers: [StreaksService],
  exports: [StreaksService],
})
export class StreaksModule {}
