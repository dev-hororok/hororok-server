import { RoleEntity } from 'apps/timer-app/src/roles/infrastructure/typeorm/role.entity';
import { Account } from '../../../domain/account';
import { AccountEntity } from '../entities/account.entity';

export class AccountMapper {
  static toDomain(raw: AccountEntity): Account {
    const account = new Account();
    account.account_id = raw.account_id;
    account.email = raw.email;
    account.password = raw.password;
    account.provider = raw.provider;
    account.social_id = raw.social_id;
    account.role = raw.role;
    account.created_at = raw.created_at;
    account.updated_at = raw.updated_at;
    account.deleted_at = raw.deleted_at;
    return account;
  }

  static toPersistence(account: Account): AccountEntity {
    let role: RoleEntity | undefined = undefined;

    if (account.role) {
      role = new RoleEntity();
      role.id = account.role.id;
    }

    const accountEntity = new AccountEntity();
    if (account.account_id && typeof account.account_id === 'number') {
      accountEntity.account_id = account.account_id;
    }
    accountEntity.email = account.email;
    accountEntity.password = account.password;
    accountEntity.provider = account.provider;
    accountEntity.social_id = account.social_id;
    accountEntity.role = role;
    accountEntity.created_at = account.created_at;
    accountEntity.updated_at = account.updated_at;
    accountEntity.deleted_at = account.deleted_at;
    return accountEntity;
  }
}
