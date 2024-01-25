import { Controller, Post, Request, UseGuards, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guard/local-auth.guard';
import { Public } from '../decorators/public.decorator';
import { JwtRefreshGuard } from '../guard/jwt-refresh.guard';
import { AccountsService } from '../../accounts/accounts.service';
import { LoginOuputDto } from '../dtos/login.dto';
import { RegisterInputDto, RegisterOutputDto } from '../dtos/register.dto';
import { RefreshTokenOuputDto } from '../dtos/refresh-token.dto';

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
  async registerAccount(
    @Body() body: RegisterInputDto,
  ): Promise<RegisterOutputDto> {
    const result = await this.accountsService.create(body);
    return { account_id: result.account_id };
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  refreshToken(@Request() req): RefreshTokenOuputDto {
    return this.authService.refreshToken(req.user);
  }
}
