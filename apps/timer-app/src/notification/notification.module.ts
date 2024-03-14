import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { ConfigService } from '@nestjs/config';
import { NotificationTokenRepository } from './repositories/notification-token.repository.interface';
import { TypeormNotificationTokenRepository } from './repositories/typeorm/notification-token.repository';
import { NotificationTokenEntity } from '../database/entities/notification-token.entity';
import { AllConfigType } from '../config/config.type';
import * as admin from 'firebase-admin';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationTokenEntity])],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    ConfigService,
    {
      provide: NotificationTokenRepository,
      useClass: TypeormNotificationTokenRepository,
    },
    {
      provide: 'FIREBASE_APP',
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllConfigType>) => {
        if (!admin.apps.length) {
          admin.initializeApp({
            credential: admin.credential.cert({
              projectId: configService.getOrThrow('notification').projectId,
              clientEmail: configService.getOrThrow('notification').clientEmail,
              privateKey: configService
                .getOrThrow('notification')
                .privateKey.replace(/\\n/g, '\n'),
            }),
          });
        }
        return admin;
      },
    },
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
