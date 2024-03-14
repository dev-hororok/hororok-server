import { Injectable } from '@nestjs/common';
import { NotificationTokenRepository } from './repositories/notification-token.repository.interface';
import { Member } from '../database/domain/member';
import { CreateNotificationTokenDto } from './dtos/create-notification-token.dto';
import { UpdateNotificationTokenDto } from './dtos/update-notification-token.dto';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationTokenRepository: NotificationTokenRepository,
  ) {}

  async acceptPushNotification(
    member: Member,
    createDto: CreateNotificationTokenDto,
  ) {
    // 기존에 사용하던 토큰들 비활성화
    await this.notificationTokenRepository.updateByMemberId(member.member_id, {
      status: 'Inactive',
    });

    // 해당 사용자가 동일한 디바이스로 토큰을 발급받은 기록이 있는지 확인 후 존재하면 토큰 업데이트 후 활성화
    const exist =
      await this.notificationTokenRepository.findOneByMemberIdAndDeviceType(
        member.member_id,
        createDto.device_type,
      );
    if (exist) {
      await this.notificationTokenRepository.updateById(
        exist.notification_token_id,
        {
          status: 'Active',
          notification_token: createDto.notification_token,
          last_used_at: new Date(),
        },
      );
    } else {
      await this.notificationTokenRepository.create({
        member: member,
        status: 'Active',
        device_type: createDto.device_type,
        notification_token: createDto.notification_token,
      });
    }
  }

  async disablePushNotification(
    member: Member,
    updateDto: UpdateNotificationTokenDto,
  ) {
    const exist =
      await this.notificationTokenRepository.findOneByMemberIdAndDeviceType(
        member.member_id,
        updateDto.device_type,
      );

    if (!exist) {
      return;
    }

    await this.notificationTokenRepository.updateById(
      exist.notification_token_id,
      {
        status: 'Inactive',
      },
    );
  }
}
