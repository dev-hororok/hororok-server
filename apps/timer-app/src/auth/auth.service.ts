import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountsService } from '../accounts/accounts.service';
import { AllConfigType } from '../config/config.type';
import { ConfigService } from '@nestjs/config';
import { LoginResponseType } from './types/login-response.type';
import { AuthProvidersEnum } from './auth-providers.enum';
import * as bcrypt from 'bcrypt';
import { RoleEnum } from '../roles/roles.enum';
import ms from 'ms';
import { AuthEmailLoginDto } from './dtos/auth-email-login.dto';
import { AuthEmailRegisterDto } from './dtos/auth-email-register.dto';
import { JwtRefreshPayloadType } from './strategies/types/jwt-refresh-payload';
import { Account } from '../database/domain/account';

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
        email: account.email,
        role: account.role?.name || 'User',
      });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: tokenExpires,
      account,
    };
  }

  async register(dto: AuthEmailRegisterDto): Promise<LoginResponseType> {
    const account = await this.accountsService.create({
      ...dto,
      email: dto.email,
      role: {
        role_id: RoleEnum.user,
      },
    });
    const { accessToken, refreshToken, tokenExpires } =
      await this.getTokensData({
        id: account.account_id,
        email: account.email,
        role: account.role?.name || 'User',
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
    email: Account['email'];
    role: string;
  }) {
    const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
      infer: true,
    });

    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const [accessToken, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          sub: data.id,
          email: data.email,
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

  async refreshToken(
    data: Pick<JwtRefreshPayloadType, 'sub'>,
  ): Promise<Omit<LoginResponseType, 'account'>> {
    const account = await this.accountsService.findOne({
      account_id: data.sub,
    });

    if (!account) {
      throw new UnauthorizedException();
    }
    const { accessToken, refreshToken, tokenExpires } =
      await this.getTokensData({
        id: account.account_id,
        email: account.email,
        role: account?.role?.name || 'User',
      });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: tokenExpires,
    };
  }
}
