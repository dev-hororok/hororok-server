import { AccountRole } from '@app/database/common/enums/account-role.enum';

export type JWTPayload = {
  sub: string;
  email: string;
  role: AccountRole;
};
