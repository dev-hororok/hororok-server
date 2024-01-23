import { Account } from '../../entities/account.model';
import { Role } from '../../entities/role.enum';

export const accountStub = (): Account => {
  return {
    account_id: '12345',
    email: 'test@test.com',
    password: '1234',
    profile_url: '',
    name: 'username',
    role: Role.USER,
  };
};
