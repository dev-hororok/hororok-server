import {
  Body,
  Controller,
  Delete,
  Post,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthEmailLoginDto } from './dtos/auth-email-login.dto';
import { LoginResponseType } from './types/login-response.type';
import { AuthEmailRegisterDto } from './dtos/auth-email-register.dto';
import { AuthGuard } from '@nestjs/passport';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { CheckEmailDto } from './dtos/check-email.dto';
import { CheckResetPasswordCodeDto } from './dtos/check-auth-code.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  // 이메일 로그인
  @SerializeOptions({
    groups: ['me'],
  })
  @Public()
  @Post('email/login')
  public login(
    @Body() loginDto: AuthEmailLoginDto,
  ): Promise<LoginResponseType> {
    return this.service.validateLogin(loginDto);
  }

  // 이메일 회원가입
  @SerializeOptions({
    groups: ['me'],
  })
  @Public()
  @Post('email/register')
  async register(
    @Body() createUserDto: AuthEmailRegisterDto,
  ): Promise<LoginResponseType> {
    return this.service.register(createUserDto);
  }

  // 이메일 확인 코드 발송
  @Public()
  @Post('email/check')
  async checkEmail(@Body() checkEmailDto: CheckEmailDto) {
    return this.service.checkEmail(checkEmailDto);
  }

  // 패스워드 분실 코드 발송
  @Public()
  @Post('password/forgot')
  async forgotPassword(@Body() checkEmailDto: CheckEmailDto) {
    return this.service.forgotPassword(checkEmailDto);
  }

  // 패스워드 분실 코드 확인 후 패스워드 초기화 jwt 발급
  @Public()
  @Post('password/check-code')
  async checkAuthCode(
    @Body() checkResetPasswordCodeDto: CheckResetPasswordCodeDto,
  ) {
    return this.service.checkAuthCode(checkResetPasswordCodeDto);
  }

  // 패스워드 초기화 jwt를 확인하여 패스워드 업데이트
  @Public()
  @Post('password/reset')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.service.resetPassword(resetPasswordDto);
  }

  // jwt 토큰 리프레시
  @Public()
  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  public refresh(
    @CurrentUser() user,
  ): Promise<Omit<LoginResponseType, 'account'>> {
    return this.service.refreshToken({
      sub: user.sub,
    });
  }

  // 계정 삭제
  @Delete('me')
  public async delete(@CurrentUser() user): Promise<void> {
    return this.service.softDelete(user);
  }
}
