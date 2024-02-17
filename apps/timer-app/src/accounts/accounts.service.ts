import { BadRequestException, Injectable } from '@nestjs/common';
import { NullableType } from '../utils/types/nullable.type';
import { AccountRepository } from './infrastructure/accounts.repository';
import { Account } from './domain/account';
import { AuthProvidersEnum } from '../auth/auth-providers.enum';
import * as bcrypt from 'bcrypt';
import { CreateAccountDto } from './dtos/create-account.dto';
import { RoleEnum } from '../roles/roles.enum';
import { EntityCondition } from '../utils/types/entity-condition.type';
import { DeepPartial } from 'typeorm';

@Injectable()
export class AccountsService {
  constructor(private readonly accountsRepository: AccountRepository) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const clonedPayload = {
      provider: AuthProvidersEnum.email,
      ...createAccountDto,
    };

    if (clonedPayload.password) {
      const salt = await bcrypt.genSalt();
      clonedPayload.password = await bcrypt.hash(clonedPayload.password, salt);
    }
    if (clonedPayload.email) {
      const accountObject = await this.accountsRepository.findOne({
        email: clonedPayload.email,
      });
      if (accountObject) {
        throw new BadRequestException('이미 사용중인 이메일입니다.');
      }
    }
    console.log(clonedPayload);

    if (clonedPayload.role?.id) {
      const roleObject = Object.values(RoleEnum).includes(
        clonedPayload.role.id,
      );
      if (!roleObject) {
        throw new BadRequestException('존재하지 않은 role입니다.');
      }
    }

    return this.accountsRepository.create(clonedPayload);
  }

  findOne(fields: EntityCondition<Account>): Promise<NullableType<Account>> {
    return this.accountsRepository.findOne(fields);
  }

  async update(
    id: Account['account_id'],
    payload: DeepPartial<Account>,
  ): Promise<Account | null> {
    const clonedPayload = { ...payload };

    if (clonedPayload.password) {
      const salt = await bcrypt.genSalt();
      clonedPayload.password = await bcrypt.hash(clonedPayload.password, salt);
    }

    if (clonedPayload.email) {
      const userObject = await this.accountsRepository.findOne({
        email: clonedPayload.email,
      });

      if (userObject?.account_id !== id) {
        throw new BadRequestException('이미 존재하는 이메일입니다.');
      }
    }

    if (clonedPayload.role?.id) {
      const roleObject = Object.values(RoleEnum).includes(
        clonedPayload.role.id,
      );
      if (!roleObject) {
        throw new BadRequestException('존재하지 않은 role입니다.');
      }
    }

    return this.accountsRepository.update(id, clonedPayload);
  }

  async softDelete(id: Account['account_id']): Promise<void> {
    await this.accountsRepository.softDelete(id);
  }
}
