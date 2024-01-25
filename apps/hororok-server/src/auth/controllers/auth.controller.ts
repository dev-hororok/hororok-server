import { Controller, Post, Request, UseGuards, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guard/local-auth.guard';
import { Public } from '../decorators/public.decorator';
import { JwtRefreshGuard } from '../guard/jwt-refresh.guard';
import { AccountsService } from '../../accounts/accounts.service';
import { CreateAccountDto } from '../../accounts/dtos/create-account.dto';
import { LoginOuputDto } from '../dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly accountsService: AccountsService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<LoginOuputDto> {
    // node 관습상 인증된 정보는 request의 user에 담긴다
    return this.authService.login(req.user);
  }

  @Public()
  @Post('register')
  async registerAccount(@Body() body: CreateAccountDto) {
    return this.accountsService.create(body);
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user);
  }
}
