import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { ConfigService } from '@nestjs/config';
import { NotificationTokenRepository } from './repositories/notification-token.repository.interface';
import { TypeormNotificationTokenRepository } from './repositories/typeorm/notification-token.repository';
import { NotificationTokenEntity } from '../database/entities/notification-token.entity';

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
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
