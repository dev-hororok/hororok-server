import { Body, Controller, Post, SerializeOptions } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { LoginResponseType } from './types/login-response.type';
import { AuthRegisterLoginDto } from './dto/auth-register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('email/login')
  public login(
    @Body() loginDto: AuthEmailLoginDto,
  ): Promise<LoginResponseType> {
    return this.service.validateLogin(loginDto);
  }

  @Post('email/register')
  async register(
    @Body() createUserDto: AuthRegisterLoginDto,
  ): Promise<LoginResponseType> {
    return this.service.register(createUserDto);
  }
}
