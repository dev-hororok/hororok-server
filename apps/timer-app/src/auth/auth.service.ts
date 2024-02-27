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
import { JwtPayloadType } from './strategies/types/jwt-payload';
import { STATUS_MESSAGES } from '../utils/constants';

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
      throw new NotFoundException(STATUS_MESSAGES.ACCOUNT.ACCOUNT_NOT_FOUND);
    }

    if (account.provider !== AuthProvidersEnum.email) {
      throw new BadRequestException(STATUS_MESSAGES.ACCOUNT.PROVIDER_MISMATCH);
    }

    if (!account.password) {
      throw new UnauthorizedException(STATUS_MESSAGES.ACCOUNT.NO_PASSWORD);
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      account.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException(
        STATUS_MESSAGES.ACCOUNT.PASSWORD_MISMATCH,
      );
    }

    const { accessToken, refreshToken, tokenExpires } =
      await this.getTokensData({
        id: account.account_id,
        email: account.email,
        role: account.role,
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
        role: account.role,
      });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: tokenExpires,
      account,
    };
  }

  async softDelete(token: JwtPayloadType): Promise<void> {
    await this.accountsService.softDelete(token.sub);
  }

  private async getTokensData(data: {
    id: Account['account_id'];
    email: Account['email'];
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
      throw new NotFoundException(STATUS_MESSAGES.ACCOUNT.ACCOUNT_NOT_FOUND);
    }
    const { accessToken, refreshToken, tokenExpires } =
      await this.getTokensData({
        id: account.account_id,
        email: account.email,
        role: account.role,
      });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: tokenExpires,
    };
  }
}
