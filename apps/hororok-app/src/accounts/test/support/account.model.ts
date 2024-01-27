import { MockModel } from '@app/database/mongodb/test/support/mock.model';
import { accountStub } from '../stubs/account.stub';
import { Account } from '@app/database/mongodb/entities/account.model';

export class AccountModel extends MockModel<Account> {
  protected entityStub = accountStub();
}
