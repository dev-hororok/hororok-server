import { Module } from '@nestjs/common';
import { MembersService } from './services/members.service';
import { MembersController } from './controllers/members.controller';
import { StreaksModule } from '../streaks/streaks.module';
import { StudyRecordsModule } from '../study-records/study-records.module';
import { CharacterInventoryModule } from '../character-inventory/character-inventory.module';
import { StudyCategoriesModule } from '../study-categories/study-categories.module';
import { MemberStudyCategoriesController } from './controllers/members-study-categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '@app/database/typeorm/entities/member.entity';
import { ItemInventoryModule } from '../item-inventory/item-inventory.module';
import { MemberInitializationService } from './services/member-initialization.service';
import { MemberStatisticsController } from './controllers/members-statistic.controller';
import { StatisticsModule } from '../statistics/statistics.module';
import { TransactionService } from '../common/transaction.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member]),
    StreaksModule,
    CharacterInventoryModule,
    ItemInventoryModule,
    StudyRecordsModule,
    StudyCategoriesModule,
    StatisticsModule,
  ],
  providers: [MembersService, MemberInitializationService, TransactionService],
  controllers: [
    MembersController,
    MemberStudyCategoriesController,
    MemberStatisticsController,
  ],
  exports: [MembersService],
})
export class MembersModule {}
