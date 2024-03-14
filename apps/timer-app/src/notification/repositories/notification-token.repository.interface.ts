import { QueryRunner } from 'typeorm';
import { NotificationToken } from '../../database/domain/notification-token';
import { NullableType } from '../../utils/types/nullable.type';
import { Member } from '../../database/domain/member';

export abstract class NotificationTokenRepository {
  abstract findOneById(
    id: NotificationToken['notification_token_id'],
    queryRunner?: QueryRunner,
  ): Promise<NullableType<NotificationToken>>;

  abstract findOneByMemberIdAndDeviceType(
    memberId: Member['member_id'],
    deviceType: NotificationToken['device_type'],
    queryRunner?: QueryRunner,
  ): Promise<NullableType<NotificationToken>>;

  abstract create(
    data: Omit<NotificationToken, 'notification_token_id' | 'last_used_at'>,
    queryRunner?: QueryRunner,
  ): Promise<NotificationToken>;

  abstract update(
    id: NotificationToken['notification_token_id'],
    payload: Partial<NotificationToken>,
    queryRunner?: QueryRunner,
  ): Promise<NullableType<NotificationToken>>;

  abstract softDelete(
    id: NotificationToken['notification_token_id'],
    queryRunner?: QueryRunner,
  ): Promise<void>;
}
