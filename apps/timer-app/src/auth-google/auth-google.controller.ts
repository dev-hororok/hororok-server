import { Body, Controller, Post, SerializeOptions } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { AuthGoogleService } from './auth-google.service';
import { LoginResponseType } from '../auth/types/login-response.type';
import { AuthGoogleLoginDto } from './dtos/auth-google-login.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('auth/google')
export class AuthGoogleController {
  constructor(
    private readonly authService: AuthService,
    private readonly authGoogleService: AuthGoogleService,
  ) {}

  @Public()
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('login')
  async login(
    @Body() loginDto: AuthGoogleLoginDto,
  ): Promise<LoginResponseType> {
    const socialData = await this.authGoogleService.getProfileByToken(loginDto);

    return this.authService.validateSocialLogin('google', socialData);
  }
}
