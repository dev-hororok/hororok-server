import { Module } from '@nestjs/common';
import { MembersService } from './services/members.service';
import { MembersController } from './controllers/members.controller';
import { StreaksModule } from '../streaks/streaks.module';
import { StudyRecordsModule } from '../study-records/study-records.module';
import { CharacterInventoryModule } from '../character-inventory/character-inventory.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemInventoryModule } from '../item-inventory/item-inventory.module';
import { MemberInitializationService } from './services/member-initialization.service';
import { MemberStatisticsController } from './controllers/members-statistic.controller';
import { StatisticsModule } from '../statistics/statistics.module';
import { TransactionService } from '../common/transaction.service';
import { MemberEntity } from '../database/entities/member.entity';
import { MemberRepository } from './repositories/member.repository.interface';
import { TypeOrmMemberRepository } from './repositories/typeorm/member.repository';
import { MemberPushController } from './controllers/members-push.controller';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MemberEntity]),
    StreaksModule,
    CharacterInventoryModule,
    ItemInventoryModule,
    StudyRecordsModule,
    StatisticsModule,
    NotificationModule,
  ],
  providers: [
    MembersService,
    MemberInitializationService,
    TransactionService,
    {
      provide: MemberRepository,
      useClass: TypeOrmMemberRepository,
    },
  ],
  controllers: [
    MembersController,
    MemberStatisticsController,
    MemberPushController,
  ],
  exports: [MembersService],
})
export class MembersModule {}
