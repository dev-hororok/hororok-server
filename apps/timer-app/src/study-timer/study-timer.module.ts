import { Module } from '@nestjs/common';
import { StudyTimerController } from './study-timer.controller';
import { StudyTimerService } from './study-timer.service';
import { StudyRecordsModule } from '../study-records/study-records.module';
import { MembersModule } from '../members/members.module';
import { ItemInventoryModule } from '../item-inventory/item-inventory.module';
import { TransactionService } from '../common/transaction.service';
import { StudyGroupGateway } from './study-group.gateway';
import { JwtModule } from '@nestjs/jwt';
import { BullModule } from '@nestjs/bull';
import { NotificationModule } from '../notification/notification.module';
import { PomodoroProcessor } from './pomodoro.processor';
import { StudyGroupRedisService } from './study-group-redis';

@Module({
  imports: [
    StudyRecordsModule,
    MembersModule,
    ItemInventoryModule,
    NotificationModule,
    BullModule.registerQueue({
      name: 'pomodoro-timer',
    }),
    JwtModule.register({}),
  ],
  controllers: [StudyTimerController],
  providers: [
    StudyTimerService,
    TransactionService,
    StudyGroupGateway,
    PomodoroProcessor,
    StudyGroupRedisService,
  ],
})
export class StudyTimerModule {}
