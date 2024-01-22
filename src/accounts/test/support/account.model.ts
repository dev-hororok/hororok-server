import { MockModel } from '@src/database/test/support/mock.model';
import { accountStub } from '../stubs/account.stub';
import { Account } from '@src/accounts/entities/account.model';

export class AccountModel extends MockModel<Account> {
  protected entityStub = accountStub();
}
