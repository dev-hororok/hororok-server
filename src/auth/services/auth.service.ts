import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account } from '../entities/accounts.model';
import { JWTPayload } from '../entities/jwt.payload';
import { CreateAccountDto } from '../dtos/create-account.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

const EXPIRE_TIME = 20 * 1000;

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(Account.name) private accountModel: Model<Account>,
  ) {}

  async validateAccount(email: string, pass: string): Promise<any> {
    const account = await this.findOneByEmail(email);
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
        expiresIn: '20s',
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
      sub: account._id,
      email: account.email,
      role: account.role,
    };
    return {
      user: account,
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '20s',
      }),
      refresh_token: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
      expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
    };
  }
  async findOneById(id: string): Promise<Account | null> {
    const account = await this.accountModel.findById(id);
    return account;
  }
  async findOneByEmail(email: string): Promise<Account | null> {
    const account = await this.accountModel.findOne({ email });
    return account;
  }

  async registerAccount({ email, password }: CreateAccountDto) {
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
