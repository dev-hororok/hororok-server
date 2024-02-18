import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthProvidersEnum } from '../auth/auth-providers.enum';
import * as bcrypt from 'bcrypt';
import { RoleEnum } from '../roles/roles.enum';
import { DeepPartial, FindOneOptions, Repository } from 'typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { NullableType } from '../utils/types/nullable.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../database/entities/account.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
  ) {}

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
        where: {
          email: clonedPayload.email,
        },
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

    return this.accountsRepository.save(
      this.accountsRepository.create(clonedPayload),
    );
  }

  findOne(options: FindOneOptions<Account>): Promise<NullableType<Account>> {
    return this.accountsRepository.findOne(options);
  }

  async update(
    id: Account['account_id'],
    payload: DeepPartial<Account>,
  ): Promise<boolean> {
    const clonedPayload = { ...payload };

    if (clonedPayload.password) {
      const salt = await bcrypt.genSalt();
      clonedPayload.password = await bcrypt.hash(clonedPayload.password, salt);
    }

    if (clonedPayload.email) {
      const userObject = await this.accountsRepository.findOne({
        where: { email: clonedPayload.email },
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
    return result.affected ? 0 < result.affected : false;
  }

  async softDelete(id: Account['account_id']): Promise<void> {
    await this.accountsRepository.softDelete(id);
  }
}
