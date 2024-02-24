import { Module } from '@nestjs/common';
import { StudyTimerController } from './study-timer.controller';
import { StudyTimerService } from './study-timer.service';
import { StudyRecordsModule } from '../study-records/study-records.module';
import { MembersModule } from '../members/members.module';
import { ItemInventoryModule } from '../item-inventory/item-inventory.module';
import { TransactionService } from '../common/transaction.service';
import { StudyGroupGateway } from './study-group.gateway';

@Module({
  imports: [StudyRecordsModule, MembersModule, ItemInventoryModule],
  controllers: [StudyTimerController],
  providers: [StudyTimerService, TransactionService, StudyGroupGateway],
})
export class StudyTimerModule {}
