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
    password: 'qwer@1234',
    role: RoleEnum.admin,
    member: {
      nickname: 'admin',
    },
  }, // 개발용
  {
    email: 'user@test.com',
    password: 'qwer@1234',
    role: RoleEnum.user,
    member: {
      nickname: 'user',
    },
  },
];
