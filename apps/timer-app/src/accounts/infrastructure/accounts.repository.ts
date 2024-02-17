import { DeepPartial } from 'typeorm';
import { Account } from '../domain/account';
import { EntityCondition } from 'apps/timer-app/src/utils/types/entity-condition.type';
import { NullableType } from 'apps/timer-app/src/utils/types/nullable.type';

export abstract class AccountRepository {
  abstract create(
    data: Omit<
      Account,
      'account_id' | 'created_at' | 'deleted_at' | 'updated_at'
    >,
  ): Promise<Account>;

  abstract findOne(
    fields: EntityCondition<Account>,
  ): Promise<NullableType<Account>>;

  abstract update(
    id: Account['account_id'],
    payload: DeepPartial<Account>,
  ): Promise<Account | null>;

  abstract softDelete(id: Account['account_id']): Promise<void>;
}
