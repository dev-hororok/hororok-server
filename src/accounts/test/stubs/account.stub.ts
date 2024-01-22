import { Account } from '@src/accounts/entities/account.model';
import { Role } from '@src/accounts/entities/role.enum';

export const accountStub = (): Account => {
  return {
    account_id: '12345',
    email: 'test@test.com',
    password: '1234',
    profile_url: '',
    name: 'username',
    role: Role.User,
  };
};
