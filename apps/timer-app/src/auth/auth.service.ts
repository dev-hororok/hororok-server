import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
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
import { SocialInterface } from './types/social.interface';
import { NullableType } from '../utils/types/nullable.type';
import { MembersService } from '../members/services/members.service';
import { TransactionService } from '../common/transaction.service';
import { CheckEmailDto } from './dtos/check-email-dto';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private accountsService: AccountsService,
    private membersService: MembersService,
    private configService: ConfigService<AllConfigType>,
    private transactionService: TransactionService,
    @InjectRedis() private readonly redisClient: Redis,
    private mailService: MailService,
  ) {}

  // 이메일 확인 메일 발송
  async checkEmail(checkEmailDto: CheckEmailDto): Promise<void> {
    const account = await this.accountsService.findOne({
      email: checkEmailDto.email,
    });
    if (account) {
      throw new BadRequestException(
        STATUS_MESSAGES.ACCOUNT.EMAIL_ALREADY_EXISTS,
      );
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    // redis 저장 후 메일 발송
    await this.redisClient.set(
      `${checkEmailDto.email}:code`,
      verificationCode,
      'EX',
      600,
    );
    await this.mailService.sendVerificationCode({
      to: checkEmailDto.email,
      code: verificationCode,
    });
  }

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

  async validateSocialLogin(
    authProvider: string,
    socialData: SocialInterface,
  ): Promise<LoginResponseType> {
    let account: NullableType<Account> = null;
    const socialEmail = socialData.email?.toLowerCase();

    // 계정이 존재하나 확인
    if (socialData.id) {
      account = await this.accountsService.findOne({
        social_id: socialData.id,
        provider: authProvider,
      });
    }

    // 없으면 새로 생성
    if (!account) {
      const role = {
        id: RoleEnum.user,
      };

      account = await this.accountsService.create({
        email: socialEmail ?? null,
        social_id: socialData.id,
        provider: authProvider,
        role: { role_id: role.id },
      });

      account = await this.accountsService.findOne({
        account_id: account.account_id,
      });
    }

    if (!account) {
      throw new UnprocessableEntityException(
        STATUS_MESSAGES.ERROR.OPERATION_FAILED,
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

  // 이메일 가입 (확인 메일로 발송된 인증코드 확인)
  async register(dto: AuthEmailRegisterDto): Promise<LoginResponseType> {
    const code = await this.redisClient.get(`${dto.email}:code`);
    if (!code) {
      throw new BadRequestException(STATUS_MESSAGES.STATUS.BAD_REQUEST);
    }

    if (code !== dto.code) {
      throw new BadRequestException(STATUS_MESSAGES.ACCOUNT.INVALID_CODE);
    }

    await this.redisClient.del(`${dto.email}:code`);

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
    await this.transactionService.executeInTransaction(async (queryRunner) => {
      const member = await this.membersService.findOneByAccountId(
        token.sub,
        queryRunner,
      );
      if (member) {
        await this.membersService.softDelete(member.member_id, queryRunner);
      }
      await this.accountsService.softDelete(token.sub, queryRunner);
    });
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
