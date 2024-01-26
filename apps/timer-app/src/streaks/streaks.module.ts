import { Module } from '@nestjs/common';
import { StreaksService } from './streaks.service';
import { StreaksProviders } from './streaks.providers';
import { DatabaseModule } from '@app/database';

@Module({
  imports: [DatabaseModule],
  providers: [...StreaksProviders, StreaksService],
  exports: [StreaksService],
})
export class StreaksModule {}
