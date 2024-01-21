import { Inject, Injectable } from '@nestjs/common';
import { FilterQuery, Model } from 'mongoose';
import { Account, AccountDocument } from './entities/account.model';

@Injectable()
export class AccountsRepository {
  constructor(
    @Inject('ACCOUNT_MODEL')
    private readonly accountModel: Model<AccountDocument>,
  ) {}

  async exists(
    accountFilterQuery: FilterQuery<Account>,
  ): Promise<{ _id: any }> {
    return this.accountModel.exists(accountFilterQuery);
  }

  async findOne(accountFilterQuery: FilterQuery<Account>): Promise<Account> {
    return this.accountModel.findOne(accountFilterQuery);
  }

  async find(accountsFilterQuery: FilterQuery<Account>): Promise<Account[]> {
    return this.accountModel.find(accountsFilterQuery);
  }

  async create(account: Account): Promise<Account> {
    const newAccount = new this.accountModel(account);
    return newAccount.save();
  }

  async findOneAndUpdate(
    accountFilterQuery: FilterQuery<Account>,
    account: Partial<Account>,
  ): Promise<Account> {
    return this.accountModel.findOneAndUpdate(accountFilterQuery, account);
  }
}
