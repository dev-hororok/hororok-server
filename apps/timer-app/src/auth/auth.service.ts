import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountsService } from '../accounts/accounts.service';
import { AllConfigType } from '../config/config.type';
import { ConfigService } from '@nestjs/config';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { LoginResponseType } from './types/login-response.type';
import { AuthRegisterLoginDto } from './dto/auth-register.dto';
import { AuthProvidersEnum } from './auth-providers.enum';
import * as bcrypt from 'bcrypt';
import { RoleEnum } from '../roles/roles.enum';
import { Account } from '../accounts/domain/account';
import ms from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private accountsService: AccountsService,
    private configService: ConfigService<AllConfigType>,
  ) {}

  async validateLogin(loginDto: AuthEmailLoginDto): Promise<LoginResponseType> {
    const account = await this.accountsService.findOne({
      email: loginDto.email,
    });

    if (!account) {
      throw new NotFoundException('계정을 찾을 수 없습니다.');
    }

    if (account.provider !== AuthProvidersEnum.email) {
      throw new BadRequestException(
        `간편 로그인 계정이 존재합니다. - ${account.provider}`,
      );
    }

    if (!account.password) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      account.password,
    );

    if (!isValidPassword) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }

    const { accessToken, refreshToken, tokenExpires } =
      await this.getTokensData({
        id: account.account_id,
        role: account.role,
      });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: tokenExpires,
      account,
    };
  }

  async register(dto: AuthRegisterLoginDto): Promise<LoginResponseType> {
    const account = await this.accountsService.create({
      ...dto,
      email: dto.email,
      role: {
        id: RoleEnum.user,
      },
    });

    const { accessToken, refreshToken, tokenExpires } =
      await this.getTokensData({
        id: account.account_id,
        role: account.role,
      });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: tokenExpires,
      account,
    };
  }

  private async getTokensData(data: {
    id: Account['account_id'];
    role: Account['role'];
  }) {
    const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
      infer: true,
    });

    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const [accessToken, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          sub: data.id,
          role: data.role,
        },
        {
          secret: this.configService.getOrThrow('auth.secret', { infer: true }),
          expiresIn: tokenExpiresIn,
        },
      ),
      await this.jwtService.signAsync(
        {
          sub: data.id,
        },
        {
          secret: this.configService.getOrThrow('auth.refreshSecret', {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow('auth.refreshExpires', {
            infer: true,
          }),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
      tokenExpires,
    };
  }
}
