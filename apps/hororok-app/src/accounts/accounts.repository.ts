import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { EntityRepository } from '@app/database/mongodb/entity.repository';
import {
  Account,
  AccountDocument,
} from '@app/database/mongodb/entities/account.model';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AccountsRepository extends EntityRepository<AccountDocument> {
  constructor(
    @InjectModel(Account.name)
    private readonly accountModel: Model<AccountDocument>,
  ) {
    super(accountModel);
  }
}
