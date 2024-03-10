import { Injectable, NotFoundException } from '@nestjs/common';
import { AccountEntity } from '../../../database/entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, QueryRunner, Repository } from 'typeorm';
import { Account } from '../../../database/domain/account';
import { EntityCondition } from '../../../utils/types/entity-condition.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { AccountsRepository } from '../accounts.repository.interface';
import { AccountMapper } from '../../../database/mappers/account.mapper';
import { STATUS_MESSAGES } from 'apps/timer-app/src/utils/constants';

@Injectable()
export class TypeOrmAccountsRepository implements AccountsRepository {
  constructor(
    @InjectRepository(AccountEntity)
    private accountsRepository: Repository<AccountEntity>,
  ) {}
  /** queryRunner 여부에 따라 account Repository를 생성 */
  private getRepository(queryRunner?: QueryRunner): Repository<AccountEntity> {
    return queryRunner
      ? queryRunner.manager.getRepository(AccountEntity)
      : this.accountsRepository;
  }

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
  ): Promise<NullableType<Account>> {
    const entity = await this.accountsRepository.findOne({
      where: { account_id: id },
    });

    if (!entity) {
      throw new NotFoundException(STATUS_MESSAGES.ACCOUNT.ACCOUNT_NOT_FOUND);
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

  async softDelete(
    id: Account['account_id'],
    queryRunner?: QueryRunner,
  ): Promise<void> {
    const repository = this.getRepository(queryRunner);
    await repository.softDelete(id);
  }
}
