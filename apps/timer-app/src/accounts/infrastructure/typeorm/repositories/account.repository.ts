import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { AccountRepository } from '../../accounts.repository';
import { AccountEntity } from '../entities/account.entity';
import { Account } from '../../../domain/account';
import { NullableType } from 'apps/timer-app/src/utils/types/nullable.type';
import { AccountMapper } from '../mappers/account.mapper';
import { EntityCondition } from 'apps/timer-app/src/utils/types/entity-condition.type';

@Injectable()
export class AccountTypeormRepository implements AccountRepository {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountsRepository: Repository<AccountEntity>,
  ) {}

  async create(data: Account): Promise<Account> {
    const persistenceModel = AccountMapper.toPersistence(data);
    const newEntity = await this.accountsRepository.save(
      this.accountsRepository.create(persistenceModel),
    );
    return AccountMapper.toDomain(newEntity);
  }

  async findOne(
    fields: EntityCondition<Account>,
  ): Promise<NullableType<Account>> {
    const entity = await this.accountsRepository.findOne({
      where: fields as FindOptionsWhere<AccountEntity>,
    });

    return entity ? AccountMapper.toDomain(entity) : null;
  }

  async update(
    id: Account['account_id'],
    payload: Partial<Account>,
  ): Promise<Account> {
    const entity = await this.accountsRepository.findOne({
      where: { account_id: id },
    });

    if (!entity) {
      throw new Error('User not found');
    }

    const updatedEntity = await this.accountsRepository.save(
      this.accountsRepository.create(
        AccountMapper.toPersistence({
          ...AccountMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return AccountMapper.toDomain(updatedEntity);
  }

  async softDelete(id: Account['account_id']): Promise<void> {
    await this.accountsRepository.softDelete(id);
  }
}
