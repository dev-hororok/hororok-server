import { Test } from '@nestjs/testing';
import { AccountsController } from '../accounts.controller';
import { AccountsService } from '../accounts.service';
import { jwtPayloadStub, readonlyAccountStub } from './stubs/account.stub';
import { EditAccountDto } from '../dtos/edit-account.dto';
import { ChangePasswordDto } from '../dtos/change-password.dto';
import { ReadOnlyAccountDto } from '@app/database/mongodb/dtos/readonly-account.dto';

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
      let account: ReadOnlyAccountDto;
      beforeEach(async () => {
        account = await accountsController.getLoggedInAccount(jwtPayloadStub());
      });

      test('AccountService가 호출됨', () => {
        expect(accountsService.findOneById).toHaveBeenCalledWith(
          readonlyAccountStub().account_id,
        );
      });

      test('Account를 반환', () => {
        expect(account).toEqual(readonlyAccountStub());
      });
    });
  });

  describe('editAccount', () => {
    describe('editAccount 호출 시', () => {
      let account: ReadOnlyAccountDto;
      let editAccountDto: EditAccountDto;
      beforeEach(async () => {
        editAccountDto = {
          name: 'woo3145',
          profile_url: 'test.png',
        };
        account = await accountsController.editAccount(
          readonlyAccountStub().account_id,
          jwtPayloadStub(),
          editAccountDto,
        );
      });

      test('AccountService가 호출됨', () => {
        expect(accountsService.update).toHaveBeenCalledWith(
          readonlyAccountStub().account_id,
          editAccountDto,
        );
      });

      test('Account를 반환', () => {
        expect(account).toEqual(readonlyAccountStub());
      });
    });
  });

  describe('changePassword', () => {
    describe('changePassword 호출 시', () => {
      let account: ReadOnlyAccountDto;
      let changePasswordDto: ChangePasswordDto;
      beforeEach(async () => {
        changePasswordDto = {
          password: 'changedPassword',
        };
        account = await accountsController.changePassword(
          readonlyAccountStub().account_id,
          jwtPayloadStub(),
          changePasswordDto,
        );
      });

      test('AccountService가 호출됨', () => {
        expect(accountsService.changePassword).toHaveBeenCalledWith(
          readonlyAccountStub().account_id,
          changePasswordDto,
        );
      });

      test('Account를 반환', () => {
        expect(account).toEqual(readonlyAccountStub());
      });
    });
  });
});
