import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { AccountDocument } from './entities/account.model';
import { EntityRepository } from '@src/database/entity.repository';

@Injectable()
export class AccountsRepository extends EntityRepository<AccountDocument> {
  constructor(
    @Inject('ACCOUNT_MODEL')
    private readonly accountModel: Model<AccountDocument>,
  ) {
    super(accountModel);
  }
}
