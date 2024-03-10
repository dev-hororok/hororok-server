import { QueryRunner } from 'typeorm';
import { Account } from '../../database/domain/account';
import { EntityCondition } from '../../utils/types/entity-condition.type';
import { NullableType } from '../../utils/types/nullable.type';

export abstract class AccountsRepository {
  abstract create(
    data: Omit<
      Account,
      'account_id' | 'created_at' | 'updated_at' | 'deleted_at'
    >,
  ): Promise<Account>;

  abstract findOne(
    fields: EntityCondition<Account>,
  ): Promise<NullableType<Account>>;

  abstract update(
    id: Account['account_id'],
    payload: Partial<Account>,
  ): Promise<NullableType<Account>>;

  abstract softDelete(
    id: Account['account_id'],
    queryRunner?: QueryRunner,
  ): Promise<void>;
}
