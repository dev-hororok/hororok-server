import { Role } from '@src/accounts/entities/role.enum';

export type JWTPayload = {
  sub: string;
  email: string;
  role: Role;
};
