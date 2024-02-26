import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { AccountEntity } from '../../entities/account.entity';
import { AccountSeeds } from '../accounts.seed';

@Injectable()
export class AccountSeedService {
  constructor(
    @InjectRepository(AccountEntity)
    private repository: Repository<AccountEntity>,
  ) {}

  async run() {
    for (const account of AccountSeeds) {
      const countAccount = await this.repository.count({
        where: {
          email: account.email,
        },
      });

      if (!countAccount) {
        const salt = await bcrypt.genSalt();
        await this.repository.save(
          this.repository.create({
            email: account.email,
            password: await bcrypt.hash(account.password, salt),
            role: {
              role_id: account.role,
            },
          }),
        );
      }
    }
  }
}
