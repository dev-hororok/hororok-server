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
import { CheckEmailDto } from './dtos/check-email-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

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

  @Public()
  @Post('email/check')
  async checkEmail(@Body() checkEmailDto: CheckEmailDto) {
    return this.service.checkEmail(checkEmailDto);
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

  @Delete('me')
  public async delete(@CurrentUser() user): Promise<void> {
    return this.service.softDelete(user);
  }
}
