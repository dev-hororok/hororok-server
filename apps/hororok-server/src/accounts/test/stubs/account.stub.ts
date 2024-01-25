import { AccountRole } from '@app/database/common/enums/account-role.enum';
import { ReadOnlyAccountDto } from '@app/database/mongoose/dtos/readonly-account.dto';
import { Account } from '@app/database/mongoose/entities/account.model';

export const accountStub = (): Account => {
  return {
    account_id: '12345',
    email: 'test@test.com',
    password: '1234',
    profile_url: '',
    name: 'username',
    role: AccountRole.USER,
  };
};

export const readonlyAccountStub = (): ReadOnlyAccountDto => {
  return {
    account_id: '12345',
    email: 'test@test.com',
    profile_url: '',
    name: 'username',
    role: AccountRole.USER,
  };
};
