import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MembersModule } from './members/members.module';
import { StreaksModule } from './streaks/streaks.module';
import { StudyRecordsModule } from './study-records/study-records.module';
import { CharacterInventoryModule } from './character-inventory/character-inventory.module';
import { StudyTimerModule } from './study-timer/study-timer.module';
import { ItemsModule } from './items/items.module';
import { ItemInventoryModule } from './item-inventory/item-inventory.module';
import { StatisticsModule } from './statistics/statistics.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { DataSource, DataSourceOptions } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { AccountsModule } from './accounts/accounts.module';
import { RolesGuard } from './roles/roles.guard';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { AuthGoogleModule } from './auth-google/auth-google.module';
import { AuthKakaoModule } from './auth-kakao/auth-kakao.module';
import { AuthNaverModule } from './auth-naver/auth-naver.module';
import { UploadModule } from './uploads/uploads.module';
import { BullModule } from '@nestjs/bull';

import { AllConfigType } from './config/config.type';
import authConfig from './auth/config/auth-config';
import uploadConfig from './uploads/config/upload-config';
import appConfig from './config/app.config';
import databaseConfig from './database/config/database-config';
import notificationConfig from './notification/config/notification-config';
import mailConfig from './mail/config/mail-config';
import redisConfig from './redis/config/redis-config';
import googleConfig from './auth-google/config/auth-google-config';
import kakaoConfig from './auth-kakao/config/auth-kakao-config';
import naverConfig from './auth-naver/config/auth-naver-config';
import { MailModule } from './mail/mail.module';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        databaseConfig,
        authConfig,
        redisConfig,
        googleConfig,
        kakaoConfig,
        naverConfig,
        uploadConfig,
        notificationConfig,
        mailConfig,
      ],
      envFilePath: [`.env.${process.env.NODE_ENV}`],
    }),
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'single',
        url: `redis://${configService.get('redis.host')}:${configService.get(
          'redis.port',
        )}`,
      }),
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        const dataSource = new DataSource(options).initialize();
        return dataSource;
      },
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<AllConfigType>) => ({
        redis: {
          host: configService.get('redis').host,
          port: configService.get('redis').port,
        },
        queues: [
          {
            name: 'pomodoro-timer',
          },
        ],
      }),
    }),
    AuthModule,
    AuthGoogleModule,
    AuthKakaoModule,
    AuthNaverModule,
    AccountsModule,
    MembersModule,
    StreaksModule,
    StudyRecordsModule,
    CharacterInventoryModule,
    StudyTimerModule,
    ItemsModule,
    ItemInventoryModule,
    StatisticsModule,
    UploadModule,
    MailModule,
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
