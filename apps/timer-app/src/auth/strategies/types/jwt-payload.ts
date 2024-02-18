import { Account } from 'apps/timer-app/src/database/domain/account';

export type JwtPayloadType = Pick<Account, 'email' | 'role'> & {
  sub: string;
  iat: number;
  exp: number;
};
