import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Account } from './entities/accounts.model';
import { Model } from 'mongoose';
import { CreateAccountDto } from './dtos/create-account.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<Account>,
  ) {}

  async findOneById(id: string): Promise<Account | null> {
    const account = await this.accountModel.findById(id);
    return account;
  }
  async findOneByEmail(email: string): Promise<Account | null> {
    const account = await this.accountModel.findOne({ email });
    return account;
  }

  async create({ email, password }: CreateAccountDto) {
    const exist = await this.accountModel.exists({ email });

    if (exist) {
      throw new BadRequestException('이미 가입된 이메일입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.accountModel.create({
      email,
      password: hashedPassword,
    });
  }
}
