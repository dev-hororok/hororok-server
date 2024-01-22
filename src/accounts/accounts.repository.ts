import { Inject, Injectable } from '@nestjs/common';
import { FilterQuery, Model } from 'mongoose';
import { Account, AccountDocument } from './entities/account.model';
import { EntityRepository } from '@src/database/entity.repository';

@Injectable()
export class AccountsRepository extends EntityRepository<AccountDocument> {
  constructor(
    @Inject('ACCOUNT_MODEL')
    private readonly accountModel: Model<AccountDocument>,
  ) {
    super(accountModel);
  }

  async exists(
    accountFilterQuery: FilterQuery<Account>,
  ): Promise<{ _id: any }> {
    return this.accountModel.exists(accountFilterQuery);
  }
}
