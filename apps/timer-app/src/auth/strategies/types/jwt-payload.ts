import { Account } from 'apps/timer-app/src/accounts/domain/account';

export type JwtPayloadType = Pick<Account, 'role'> & {
  sub: string;
  iat: number;
  exp: number;
};
