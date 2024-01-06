import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account } from './entities/accounts.model';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectModel(Account.name) private accountModel: Model<Account>,
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const account = await this.findOneByEmail(email);

    if (account === null || account.password !== pass) {
      throw new UnauthorizedException('패스워드가 틀렸습니다.');
    }

    const payload = { sub: account._id, email: account.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async findOneByEmail(email: string): Promise<Account | null> {
    const account = await this.accountModel.findOne({ email });

    return account ? account.toJSON() : null;
  }
}
