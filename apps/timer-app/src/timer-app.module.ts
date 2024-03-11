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
import appConfig from './config/app.config';
import databaseConfig from './database/config/database-config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { DataSource, DataSourceOptions } from 'typeorm';
import authConfig from './auth/config/auth-config';
import { AuthModule } from './auth/auth.module';
import { AccountsModule } from './accounts/accounts.module';
import { RolesGuard } from './roles/roles.guard';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RedisModule } from '@nestjs-modules/ioredis';
import { AllConfigType } from './config/config.type';
import redisConfig from './config/redis-config';
import googleConfig from './auth-google/config/auth-google-config';
import kakaoConfig from './auth-kakao/config/auth-kakao-config';
import naverConfig from './auth-naver/config/auth-naver-config';
import { AuthGoogleModule } from './auth-google/auth-google.module';
import { AuthKakaoModule } from './auth-kakao/auth-kakao.module';
import { AuthNaverModule } from './auth-naver/auth-naver.module';
import uploadConfig from './uploads/config/upload-config';
import { UploadModule } from './uploads/uploads.module';

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
      ],
      envFilePath: [`.env.${process.env.NODE_ENV}`],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        const dataSource = new DataSource(options).initialize();
        return dataSource;
      },
    }),
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<AllConfigType>) => ({
        type: 'single',
        url: `redis://${configService.get('redis').host}:${
          configService.get('redis').port
        }`,
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
