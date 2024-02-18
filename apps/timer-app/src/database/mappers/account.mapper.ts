import { Account } from '../domain/account';
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
    if (raw.member) {
      account.member = raw.member; // mapper
    }
    account.created_at = raw.created_at;
    account.updated_at = raw.updated_at;
    account.deleted_at = raw.deleted_at;
    return account;
  }
}
