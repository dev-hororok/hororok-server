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

  abstract findActiveTokenByMemberId(
    memberId: Member['member_id'],
    queryRunner?: QueryRunner,
  ): Promise<NullableType<NotificationToken>>;

  abstract create(
    data: Omit<NotificationToken, 'notification_token_id' | 'last_used_at'>,
    queryRunner?: QueryRunner,
  ): Promise<NotificationToken>;

  abstract updateById(
    id: NotificationToken['notification_token_id'],
    payload: Partial<NotificationToken>,
    queryRunner?: QueryRunner,
  ): Promise<void>;

  abstract updateByMemberId(
    id: Member['member_id'],
    payload: Partial<NotificationToken>,
    queryRunner?: QueryRunner,
  ): Promise<void>;

  abstract softDelete(
    id: NotificationToken['notification_token_id'],
    queryRunner?: QueryRunner,
  ): Promise<void>;
}
