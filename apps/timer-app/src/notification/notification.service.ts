import { Inject, Injectable } from '@nestjs/common';
import { NotificationTokenRepository } from './repositories/notification-token.repository.interface';
import { Member } from '../database/domain/member';
import { CreateNotificationTokenDto } from './dtos/create-notification-token.dto';
import { UpdateNotificationTokenDto } from './dtos/update-notification-token.dto';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationTokenRepo: NotificationTokenRepository,
    @Inject('FIREBASE_APP') private readonly firebaseAdmin,
  ) {}

  async acceptPushNotification(
    member: Member,
    createDto: CreateNotificationTokenDto,
  ) {
    // 기존에 사용하던 토큰들 비활성화
    await this.notificationTokenRepo.updateByMemberId(member.member_id, {
      status: 'Inactive',
    });
    // 해당 사용자가 동일한 디바이스로 토큰을 발급받은 기록이 있는지 확인 후 존재하면 토큰 업데이트 후 활성화
    const exist =
      await this.notificationTokenRepo.findOneByMemberIdAndDeviceType(
        member.member_id,
        createDto.device_type,
      );
    if (exist) {
      await this.notificationTokenRepo.updateById(exist.notification_token_id, {
        status: 'Active',
        notification_token: createDto.notification_token,
        last_used_at: new Date(),
      });
    } else {
      await this.notificationTokenRepo.create({
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
      await this.notificationTokenRepo.findOneByMemberIdAndDeviceType(
        member.member_id,
        updateDto.device_type,
      );

    if (!exist) {
      return;
    }

    await this.notificationTokenRepo.updateById(exist.notification_token_id, {
      status: 'Inactive',
    });
  }

  sendPush = async (
    member: Member,
    title: string,
    body: string,
  ): Promise<void> => {
    try {
      const notificationToken =
        await this.notificationTokenRepo.findActiveTokenByMemberId(
          member.member_id,
        );
      if (notificationToken) {
        await this.firebaseAdmin
          .messaging()
          .send({
            notification: { title, body },
            token: notificationToken.notification_token,
            android: { priority: 'high' },
          })
          .catch((error: any) => {
            console.error(error);
          });
      }
    } catch (error) {
      return error;
    }
  };
}
