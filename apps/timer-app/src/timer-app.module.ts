import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard, RolesGuard } from '@app/auth';
import { SharedAuthModule } from '@app/auth/auth.module';
import { MembersModule } from './members/members.module';
import { StreaksModule } from './streaks/streaks.module';
import { StudyRecordsModule } from './study-records/study-records.module';
import { CharacterInventoryModule } from './character-inventory/character-inventory.module';
import { StudyCategoriesModule } from './study-categories/study-categories.module';
import { StudyTimerModule } from './study-timer/study-timer.module';
import { ItemsModule } from './items/items.module';
import { ItemInventoryModule } from './item-inventory/item-inventory.module';
import { CacheModule } from '@nestjs/cache-manager';
import { StatisticsModule } from './statistics/statistics.module';
import { AuthModule } from './auth/auth.module';
import { AccountsModule } from './accounts/accounts.module';
import * as redisStore from 'cache-manager-redis-store';
import databaseConfig from './database/config/database-config';
import authConfig from './auth/config/auth.config';
import appConfig from './config/app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { DataSource, DataSourceOptions } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, authConfig],
      envFilePath: ['.env'],
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
    SharedAuthModule,
    MembersModule,
    StreaksModule,
    StudyRecordsModule,
    CharacterInventoryModule,
    StudyCategoriesModule,
    StudyTimerModule,
    ItemsModule,
    ItemInventoryModule,
    StatisticsModule,
    AuthModule,
    AccountsModule,
  ],
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
