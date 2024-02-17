import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthEmailLoginDto } from './dtos/auth-email-login.dto';
import { LoginResponseType } from './types/login-response.type';
import { AuthEmailRegisterDto } from './dtos/auth-email-register.dto';
import { AuthGuard } from '@nestjs/passport';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Public()
  @Post('email/login')
  public login(
    @Body() loginDto: AuthEmailLoginDto,
  ): Promise<LoginResponseType> {
    return this.service.validateLogin(loginDto);
  }

  @Public()
  @Post('email/register')
  async register(
    @Body() createUserDto: AuthEmailRegisterDto,
  ): Promise<LoginResponseType> {
    return this.service.register(createUserDto);
  }

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
}
