import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from '../entities/jwt.payload';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { AccountsService } from 'src/accounts/accounts.service';

const EXPIRE_TIME = 20 * 1000;

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly accountsService: AccountsService,
  ) {}

  async validateAccount(email: string, pass: string): Promise<any> {
    const account = await this.accountsService.findOneByEmail(email);
    if (account && bcrypt.compareSync(pass, account.password)) {
      return account.readOnlyData;
    }
    return null;
  }

  async refreshToken(account: any) {
    const payload: JWTPayload = {
      sub: account.sub,
      email: account.email,
      role: account.role,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '1d',
      }),
      refresh_token: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
      expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
    };
  }

  async login(account: any) {
    const payload: JWTPayload = {
      sub: account.id,
      email: account.email,
      role: account.role,
    };
    return {
      user: account,
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '1d',
      }),
      refresh_token: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
      expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
    };
  }
}
