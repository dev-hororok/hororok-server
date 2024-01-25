import { SetMetadata } from '@nestjs/common';
import { AccountRole } from '@app/database/common/enums/account-role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: AccountRole[]) => SetMetadata(ROLES_KEY, roles);
