import { Body, Controller, Post, SerializeOptions } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Public } from '../auth/decorators/public.decorator';
import { AuthKakaoService } from './auth-kakao.service';
import { AuthKakaoLoginDto } from './dtos/auth-kakao-login.dto';
import { LoginResponseType } from '../auth/types/login-response.type';

@Controller('auth/kakao')
export class AuthKakaoController {
  constructor(
    private readonly authService: AuthService,
    private readonly authKakaoService: AuthKakaoService,
  ) {}

  @Public()
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('login')
  async login(@Body() loginDto: AuthKakaoLoginDto): Promise<LoginResponseType> {
    const socialData = await this.authKakaoService.getProfileByCode(loginDto);
    return this.authService.validateSocialLogin('kakao', socialData);
  }
}
