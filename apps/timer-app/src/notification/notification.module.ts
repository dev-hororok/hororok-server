import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationToken } from '../database/domain/notification-token';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationToken])],
  controllers: [NotificationController],
  providers: [NotificationService, ConfigService],
  exports: [NotificationService],
})
export class NotificationModule {}
