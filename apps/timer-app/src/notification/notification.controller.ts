import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../config/config.type';
import { STATUS_MESSAGES } from '../utils/constants';

@Controller('notification')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  @Get('public-key')
  getPublicKey() {
    const publicKey = this.configService.getOrThrow('notification', {
      infer: true,
    }).vapidPublicKey;

    if (!publicKey) {
      throw new InternalServerErrorException(
        STATUS_MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
      );
    }
    return { public_key: publicKey };
  }
}
