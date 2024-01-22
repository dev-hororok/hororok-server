import { accountStub } from '../test/stubs/account.stub';

export const AccountsService = jest.fn().mockReturnValue({
  findOneById: jest.fn().mockResolvedValue(accountStub()),
  findOneByEmail: jest.fn().mockResolvedValue(accountStub()),
  create: jest.fn().mockResolvedValue(accountStub()),
  changePassword: jest.fn().mockResolvedValue(accountStub()),
  update: jest.fn().mockResolvedValue(accountStub()),
});
