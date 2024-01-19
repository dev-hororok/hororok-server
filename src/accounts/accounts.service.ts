import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Account } from './entities/accounts.model';
import { Model } from 'mongoose';
import { CreateAccountDto } from './dtos/create-account.dto';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { EditAccountDto } from './dtos/edit-account.dto';

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
    const newAccount = new this.accountModel({
      email,
      password: hashedPassword,
    });
    await newAccount.save();
  }

  async changePassword(account_id: string, { password }: ChangePasswordDto) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedAccount = await this.accountModel.findByIdAndUpdate(
      account_id,
      { password: hashedPassword },
      { new: true },
    );

    if (!updatedAccount) {
      throw new BadRequestException('계정이 존재하지 않습니다.');
    }

    return updatedAccount;
  }

  async update(account_id: string, editAccountDto: EditAccountDto) {
    const updatedAccount = await this.accountModel.findByIdAndUpdate(
      account_id,
      editAccountDto,
      { new: true },
    );

    if (!updatedAccount) {
      throw new BadRequestException('계정이 존재하지 않습니다.');
    }

    return updatedAccount;
  }
}
