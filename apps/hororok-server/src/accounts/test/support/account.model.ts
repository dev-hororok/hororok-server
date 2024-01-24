import { Account } from '@app/database/mongoose/entities/account.model';
import { accountStub } from '../stubs/account.stub';
import { MockModel } from '@app/database/mongoose/test/support/mock.model';

export class AccountModel extends MockModel<Account> {
  protected entityStub = accountStub();
}
