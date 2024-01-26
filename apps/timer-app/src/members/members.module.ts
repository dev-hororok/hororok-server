import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { DatabaseModule } from '@app/database';
import { MembersProviders } from './members.providers';
import { StreaksModule } from '../streaks/streaks.module';
import { EggInventoryModule } from '../egg-inventory/egg-inventory.module';
import { StudyRecordsModule } from '../study-records/study-records.module';

@Module({
  imports: [
    DatabaseModule,
    StreaksModule,
    EggInventoryModule,
    StudyRecordsModule,
  ],
  providers: [...MembersProviders, MembersService],
  controllers: [MembersController],
})
export class MembersModule {}
