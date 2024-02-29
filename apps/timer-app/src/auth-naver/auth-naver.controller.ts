import { Body, Controller, Post, SerializeOptions } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { LoginResponseType } from '../auth/types/login-response.type';
import { Public } from '../auth/decorators/public.decorator';
import { AuthNaverService } from './auth-naver.service';
import { AuthNaverLoginDto } from './dtos/auth-naver-login.dto';

@Controller('auth/naver')
export class AuthNaverController {
  constructor(
    private readonly authService: AuthService,
    private readonly authNaverService: AuthNaverService,
  ) {}

  @Public()
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('login')
  async login(@Body() loginDto: AuthNaverLoginDto): Promise<LoginResponseType> {
    const socialData = await this.authNaverService.getProfileByCode(loginDto);
    return this.authService.validateSocialLogin('naver', socialData);
  }
}
