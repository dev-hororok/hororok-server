import { NotificationToken } from 'apps/timer-app/src/database/domain/notification-token';
import { NullableType } from 'apps/timer-app/src/utils/types/nullable.type';
import { QueryRunner, Repository } from 'typeorm';
import { NotificationTokenRepository } from '../notification-token.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';

export class TypeormNotificationTokenRepository
  implements NotificationTokenRepository
{
  constructor(
    @InjectRepository(NotificationToken)
    private notificationTokenRepository: Repository<NotificationToken>,
  ) {}

  /** queryRunner 여부에 따라 notificationToken Repository를 생성 */
  private getRepository(
    queryRunner?: QueryRunner,
  ): Repository<NotificationToken> {
    return queryRunner
      ? queryRunner.manager.getRepository(NotificationToken)
      : this.notificationTokenRepository;
  }

  async findOneById(
    id: number,
    queryRunner?: QueryRunner | undefined,
  ): Promise<NullableType<NotificationToken>> {
    const repository = this.getRepository(queryRunner);

    const entity = await repository.findOne({
      where: {
        notification_token_id: id,
      },
    });

    return entity;
  }

  async findOneByMemberIdAndDeviceType(
    memberId: string,
    deviceType: string,
    queryRunner?: QueryRunner | undefined,
  ): Promise<NullableType<NotificationToken>> {
    const repository = this.getRepository(queryRunner);

    const entity = await repository.findOne({
      where: {
        member: {
          member_id: memberId,
        },
        device_type: deviceType,
      },
    });

    return entity;
  }

  async create(
    data: Omit<NotificationToken, 'notification_token_id' | 'last_used_at'>,
    queryRunner?: QueryRunner | undefined,
  ): Promise<NotificationToken> {
    const repository = this.getRepository(queryRunner);
    const newEntity = await repository.save(
      repository.create({
        ...data,
      }),
    );

    return newEntity;
  }

  async update(
    id: number,
    payload: Partial<NotificationToken>,
    queryRunner?: QueryRunner | undefined,
  ): Promise<NullableType<NotificationToken>> {
    const repository = this.getRepository(queryRunner);
    await repository.update(id, payload);
    return repository.findOne({ where: { notification_token_id: id } });
  }

  async softDelete(
    id: number,
    queryRunner?: QueryRunner | undefined,
  ): Promise<void> {
    const repository = this.getRepository(queryRunner);
    await repository.softDelete(id);
  }
}
