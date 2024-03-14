import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationToken } from '../database/domain/notification-token';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { ConfigService } from '@nestjs/config';
import { NotificationTokenRepository } from './repositories/notification-token.repository.interface';
import { TypeormNotificationTokenRepository } from './repositories/typeorm/notification-token.repository';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationToken])],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    ConfigService,
    {
      provide: NotificationTokenRepository,
      useClass: TypeormNotificationTokenRepository,
    },
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
