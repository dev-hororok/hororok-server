import { Account } from '../../database/domain/account';

export type LoginResponseType = Readonly<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
  account: Account;
}>;
