import { MockModel } from '../../../database/test/support/mock.model';
import { Account } from '../../entities/account.model';
import { accountStub } from '../stubs/account.stub';

export class AccountModel extends MockModel<Account> {
  protected entityStub = accountStub();
}
