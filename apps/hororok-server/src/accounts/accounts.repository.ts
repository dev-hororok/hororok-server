import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { AccountDocument } from '@app/database/mongoose/entities/account.model';
import { EntityRepository } from '@app/database/mongoose/entity.repository';

@Injectable()
export class AccountsRepository extends EntityRepository<AccountDocument> {
  constructor(
    @Inject('ACCOUNT_MODEL')
    private readonly accountModel: Model<AccountDocument>,
  ) {
    super(accountModel);
  }
}
