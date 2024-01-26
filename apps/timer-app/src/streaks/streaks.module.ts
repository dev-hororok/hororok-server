import { Module } from '@nestjs/common';
import { StreaksService } from './streaks.service';
import { StreaksProviders } from './streaks.providers';

@Module({
  providers: [...StreaksProviders, StreaksService],
  exports: [StreaksService],
})
export class StreaksModule {}
