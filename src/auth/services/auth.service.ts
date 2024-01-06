import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account } from '../entities/accounts.model';
import { JWTPayload } from '../entities/jwt.payload';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(Account.name) private accountModel: Model<Account>,
  ) {}

  async validateAccount(email: string, pass: string): Promise<any> {
    const account = await this.findOneByEmail(email);
    if (account && account.password === pass) {
      // eslint-disable-next-line
      const { password: _, ...result } = account;
      return result;
    }
    return null;
  }

  async login(account: any) {
    const payload: JWTPayload = {
      sub: account._id,
      email: account.email,
      role: account.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async findOneByEmail(email: string): Promise<any | null> {
    const account = await this.accountModel.findOne({ email });
    return account;
  }
}
