import { Module } from '@nestjs/common';
import { TimerAppController } from './timer-app.controller';
import { DatabaseModule } from '@app/database';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard, RolesGuard } from '@app/auth';
import { SharedAuthModule } from '@app/auth/auth.module';
import { MembersModule } from './members/members.module';
import { StreaksModule } from './streaks/streaks.module';
import { EggInventoryModule } from './egg-inventory/egg-inventory.module';
import { StudyRecordsModule } from './study-records/study-records.module';
import { StatisticsModule } from './statistics/statistics.module';
import { CharacterInventoryModule } from './character-inventory/character-inventory.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    SharedAuthModule,
    MembersModule,
    StreaksModule,
    EggInventoryModule,
    StudyRecordsModule,
    StatisticsModule,
    CharacterInventoryModule,
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
