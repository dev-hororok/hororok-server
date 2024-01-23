import { Test } from '@nestjs/testing';
import { AccountsController } from '../accounts.controller';
import { AccountsService } from '../accounts.service';
import { accountStub } from './stubs/account.stub';
import { Account } from '../entities/account.model';
import { EditAccountDto } from '../dtos/edit-account.dto';
import { ChangePasswordDto } from '../dtos/change-password.dto';

jest.mock('../accounts.service');

describe('AccountsController', () => {
  let accountsController: AccountsController;
  let accountsService: AccountsService;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [AccountsController],
      providers: [AccountsService],
    }).compile();

    accountsController = moduleRef.get<AccountsController>(AccountsController);
    accountsService = moduleRef.get<AccountsService>(AccountsService);
    jest.clearAllMocks();
  });

  describe('getLoggedInAccount', () => {
    describe('getLoggedInAccount 호출 시', () => {
      let account: Account;
      beforeEach(async () => {
        account = await accountsController.getLoggedInAccount({
          user: { sub: accountStub().account_id },
        });
      });

      test('AccountService가 호출됨', () => {
        expect(accountsService.findOneById).toHaveBeenCalledWith(
          accountStub().account_id,
        );
      });

      test('Account를 반환', () => {
        expect(account).toEqual(accountStub());
      });
    });
  });

  describe('editAccount', () => {
    describe('editAccount 호출 시', () => {
      let account: Account;
      let editAccountDto: EditAccountDto;
      beforeEach(async () => {
        editAccountDto = {
          name: 'woo3145',
          profile_url: 'test.png',
        };
        account = await accountsController.editAccount(
          accountStub().account_id,
          { user: { sub: accountStub().account_id } },
          editAccountDto,
        );
      });

      test('AccountService가 호출됨', () => {
        expect(accountsService.update).toHaveBeenCalledWith(
          accountStub().account_id,
          editAccountDto,
        );
      });

      test('Account를 반환', () => {
        expect(account).toEqual(accountStub());
      });
    });
  });

  describe('changePassword', () => {
    describe('changePassword 호출 시', () => {
      let account: Account;
      let changePasswordDto: ChangePasswordDto;
      beforeEach(async () => {
        changePasswordDto = {
          password: 'changedPassword',
        };
        account = await accountsController.changePassword(
          accountStub().account_id,
          { user: { sub: accountStub().account_id } },
          changePasswordDto,
        );
      });

      test('AccountService가 호출됨', () => {
        expect(accountsService.changePassword).toHaveBeenCalledWith(
          accountStub().account_id,
          changePasswordDto,
        );
      });

      test('Account를 반환', () => {
        expect(account).toEqual(accountStub());
      });
    });
  });
});
