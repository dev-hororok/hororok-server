import { Account } from '../domain/account';
import { AccountEntity } from '../entities/account.entity';
import { MemberEntity } from '../entities/member.entity';
import { RoleEntity } from '../entities/role.entity';
import { MemberMapper } from './member.mapper';

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
      account.member = MemberMapper.toDomain(raw.member); // mapper
    }
    account.created_at = raw.created_at;
    account.updated_at = raw.updated_at;
    account.deleted_at = raw.deleted_at;
    return account;
  }

  static toPersistence(account: Account): AccountEntity {
    let role: RoleEntity | undefined = undefined;

    if (account.role) {
      role = new RoleEntity();
      role.role_id = account.role.role_id;
    }

    let member: MemberEntity | undefined = undefined;

    if (account.member) {
      member = new MemberEntity();
      member.member_id = account.member.member_id;
    }

    const accountEntity = new AccountEntity();
    accountEntity.account_id = account.account_id;
    accountEntity.email = account.email;
    accountEntity.password = account.password;
    accountEntity.provider = account.provider;
    accountEntity.social_id = account.social_id;

    accountEntity.role = account.role;
    accountEntity.member = member;

    accountEntity.created_at = account.created_at;
    accountEntity.updated_at = account.updated_at;
    accountEntity.deleted_at = account.deleted_at;

    return accountEntity;
  }
}
