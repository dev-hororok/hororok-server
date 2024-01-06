import { Role } from './role.enum';

export type JWTPayload = {
  sub: string;
  email: string;
  role: Role;
};
