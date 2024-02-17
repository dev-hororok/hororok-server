import { Account } from 'apps/timer-app/src/database/entities/account.entity';

export type JwtPayloadType = Pick<Account, 'email' | 'role'> & {
  sub: string;
  iat: number;
  exp: number;
};
