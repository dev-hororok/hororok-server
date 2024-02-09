import { JWTPayload } from '@app/auth';
import { AccountRole } from '@app/database/common/enums/account-role.enum';
import { ReadOnlyAccountDto } from '@app/database/mongodb/dtos/readonly-account.dto';
import { Account } from '@app/database/mongodb/entities/account.model';

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

export const jwtPayloadStub = (): JWTPayload => {
  return {
    sub: '12345',
    email: 'test@test.com',
    role: AccountRole.USER,
  };
};
