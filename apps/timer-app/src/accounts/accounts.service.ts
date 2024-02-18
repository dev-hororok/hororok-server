import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthProvidersEnum } from '../auth/auth-providers.enum';
import * as bcrypt from 'bcrypt';
import { RoleEnum } from '../roles/roles.enum';
import { CreateAccountDto } from './dto/create-account.dto';
import { NullableType } from '../utils/types/nullable.type';
import { Account } from '../database/domain/account';
import { AccountsRepository } from './repositories/accounts.repository.interface';
import { EntityCondition } from '../utils/types/entity-condition.type';

@Injectable()
export class AccountsService {
  constructor(private readonly accountsRepository: AccountsRepository) {}

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

    if (clonedPayload.role?.role_id) {
      const roleObject = Object.values(RoleEnum).includes(
        clonedPayload.role.role_id,
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
    payload: Partial<Account>,
  ): Promise<NullableType<Account>> {
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

    if (clonedPayload.role?.role_id) {
      const roleObject = Object.values(RoleEnum).includes(
        clonedPayload.role.role_id,
      );
      if (!roleObject) {
        throw new BadRequestException('존재하지 않은 role입니다.');
      }
    }
    const result = await this.accountsRepository.update(id, clonedPayload);
    return result;
  }

  async softDelete(id: Account['account_id']): Promise<void> {
    await this.accountsRepository.softDelete(id);
  }
}
