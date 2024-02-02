import { Module } from '@nestjs/common';
import { TimerAppController } from './timer-app.controller';
import { TypeormDBModule } from '@app/database';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard, RolesGuard } from '@app/auth';
import { SharedAuthModule } from '@app/auth/auth.module';
import { MembersModule } from './members/members.module';
import { StreaksModule } from './streaks/streaks.module';
import { EggInventoryModule } from './egg-inventory/egg-inventory.module';
import { StudyRecordsModule } from './study-records/study-records.module';
import { CharacterInventoryModule } from './character-inventory/character-inventory.module';
import { StudyCategoriesModule } from './study-categories/study-categories.module';
import { StudyTimerModule } from './study-timer/study-timer.module';
import { ItemsModule } from './items/items.module';
import { ItemInventoryModule } from './item-inventory/item-inventory.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeormDBModule,
    SharedAuthModule,
    MembersModule,
    StreaksModule,
    EggInventoryModule,
    StudyRecordsModule,
    CharacterInventoryModule,
    StudyCategoriesModule,
    StudyTimerModule,
    ItemsModule,
    ItemInventoryModule,
  ],
  controllers: [TimerAppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class TimerAppModule {}
