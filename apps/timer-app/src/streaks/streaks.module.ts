import { Module } from '@nestjs/common';
import { StreaksService } from './streaks.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([StreaksModule])],
  providers: [StreaksService],
  exports: [StreaksService],
})
export class StreaksModule {}
