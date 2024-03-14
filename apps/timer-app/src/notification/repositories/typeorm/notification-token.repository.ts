import { NullableType } from 'apps/timer-app/src/utils/types/nullable.type';
import { QueryRunner, Repository } from 'typeorm';
import { NotificationTokenRepository } from '../notification-token.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationTokenEntity } from 'apps/timer-app/src/database/entities/notification-token.entity';

export class TypeormNotificationTokenRepository
  implements NotificationTokenRepository
{
  constructor(
    @InjectRepository(NotificationTokenEntity)
    private notificationTokenRepository: Repository<NotificationTokenEntity>,
  ) {}

  /** queryRunner 여부에 따라 notificationToken Repository를 생성 */
  private getRepository(
    queryRunner?: QueryRunner,
  ): Repository<NotificationTokenEntity> {
    return queryRunner
      ? queryRunner.manager.getRepository(NotificationTokenEntity)
      : this.notificationTokenRepository;
  }

  async findActiveTokenByMemberId(
    memberId: string,
    queryRunner?: QueryRunner | undefined,
  ): Promise<NullableType<NotificationTokenEntity>> {
    const repository = this.getRepository(queryRunner);

    const entity = await repository.findOne({
      where: {
        member: {
          member_id: memberId,
        },
        status: 'Active',
      },
    });

    return entity;
  }

  async findOneById(
    id: number,
    queryRunner?: QueryRunner | undefined,
  ): Promise<NullableType<NotificationTokenEntity>> {
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
  ): Promise<NullableType<NotificationTokenEntity>> {
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
    data: Omit<
      NotificationTokenEntity,
      'notification_token_id' | 'last_used_at'
    >,
    queryRunner?: QueryRunner | undefined,
  ): Promise<NotificationTokenEntity> {
    const repository = this.getRepository(queryRunner);
    const newEntity = await repository.save(
      repository.create({
        ...data,
        last_used_at: new Date(),
      }),
    );

    return newEntity;
  }

  async updateById(
    id: number,
    payload: Partial<NotificationTokenEntity>,
    queryRunner?: QueryRunner | undefined,
  ): Promise<void> {
    const repository = this.getRepository(queryRunner);
    await repository.update(id, payload);
  }

  async updateByMemberId(
    id: string,
    payload: Partial<NotificationTokenEntity>,
    queryRunner?: QueryRunner | undefined,
  ): Promise<void> {
    const repository = this.getRepository(queryRunner);
    try {
      await repository.update({ member: { member_id: id } }, payload);
    } catch (e) {
      console.log(e);
    }
  }

  async softDelete(
    id: number,
    queryRunner?: QueryRunner | undefined,
  ): Promise<void> {
    const repository = this.getRepository(queryRunner);
    await repository.softDelete(id);
  }
}
