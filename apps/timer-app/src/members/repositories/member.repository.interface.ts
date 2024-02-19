import { QueryRunner } from 'typeorm';
import { EntityCondition } from '../../utils/types/entity-condition.type';
import { Member } from '../../database/domain/member';
import { NullableType } from '../../utils/types/nullable.type';
import { Account } from '../../database/domain/account';

export abstract class MemberRepository {
  abstract findAll(
    options?: EntityCondition<Member>,
    queryRunner?: QueryRunner,
  ): Promise<Member[]>;

  abstract findOne(
    options?: EntityCondition<Member>,
    queryRunner?: QueryRunner,
  ): Promise<NullableType<Member>>;

  abstract findOneById(
    id: Member['member_id'],
    queryRunner?: QueryRunner,
  ): Promise<NullableType<Member>>;

  abstract findOneByAccountId(
    accountId: Account['account_id'],
    queryRunner?: QueryRunner,
  ): Promise<NullableType<Member>>;

  abstract create(
    accountId: Account['account_id'],
    data: Omit<
      Member,
      'member_id' | 'created_at' | 'updated_at' | 'deleted_at'
    >,
    queryRunner?: QueryRunner,
  ): Promise<Member>;

  abstract update(
    id: Member['member_id'],
    payload: Partial<Member>,
    queryRunner?: QueryRunner,
  ): Promise<NullableType<Member>>;

  abstract softDelete(
    id: Member['member_id'],
    queryRunner?: QueryRunner,
  ): Promise<void>;
}
