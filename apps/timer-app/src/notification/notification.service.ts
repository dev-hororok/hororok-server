import { Injectable } from '@nestjs/common';
import { NotificationTokenRepository } from './repositories/notification-token.repository.interface';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationTokenRepository: NotificationTokenRepository,
  ) {}
}
