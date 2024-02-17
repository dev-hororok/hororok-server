import { Account } from '../../database/entities/account.entity';

export type LoginResponseType = Readonly<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
  account: Account;
}>;
