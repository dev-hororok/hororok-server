import { RoleEnum } from 'apps/timer-app/src/roles/roles.enum';

export const RoleSeeds = [
  {
    id: RoleEnum.admin,
    name: 'Admin',
  },
  {
    id: RoleEnum.user,
    name: 'User',
  },
];

export const AccountSeeds = [
  {
    email: 'admin@test.com',
    password: 'qwer1234',
    role: RoleEnum.admin,
    member: {
      nickname: 'admin',
    },
  },
  {
    email: 'user@test.com',
    password: 'qwer1234',
    role: RoleEnum.user,
    member: {
      nickname: 'user',
    },
  },
];
