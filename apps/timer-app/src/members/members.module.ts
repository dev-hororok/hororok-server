import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { DatabaseModule } from '@app/database';
// import { MembersProviders } from './members.providers';
import { StreaksModule } from '../streaks/streaks.module';
import { EggInventoryModule } from '../egg-inventory/egg-inventory.module';
import { StudyRecordsModule } from '../study-records/study-records.module';
import { StatisticsModule } from '../statistics/statistics.module';
import { CharacterInventoryModule } from '../character-inventory/character-inventory.module';
import { StudyCategoriesModule } from '../study-categories/study-categories.module';
import { MemberStudyCategoriesController } from './members-study-categories.controller';
import { MembersProviders } from './members.providers';

@Module({
  imports: [
    DatabaseModule,
    StreaksModule,
    EggInventoryModule,
    CharacterInventoryModule,
    StudyRecordsModule,
    StatisticsModule,
    StudyCategoriesModule,
  ],
  providers: [...MembersProviders, MembersService],
  controllers: [MembersController, MemberStudyCategoriesController],
})
export class MembersModule {}
