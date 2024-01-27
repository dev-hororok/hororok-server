import { Controller, Post, Request, UseGuards, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guard/local-auth.guard';
import { JwtRefreshGuard } from '../guard/jwt-refresh.guard';
import { AccountsService } from '../../accounts/accounts.service';
import { LoginOutputDto } from '../dtos/login.dto';
import { RegisterInputDto, RegisterOutputDto } from '../dtos/register.dto';
import { RefreshTokenOuputDto } from '../dtos/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly accountsService: AccountsService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<LoginOutputDto> {
    console.log('******************************');
    console.log(req);
    return this.authService.login(req.user);
  }

  @Post('register')
  async registerAccount(
    @Body() body: RegisterInputDto,
  ): Promise<RegisterOutputDto> {
    console.log('******************************');
    console.log(body);
    const result = await this.accountsService.create(body);
    return { account_id: result.account_id };
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refreshToken(@Request() req): Promise<RefreshTokenOuputDto> {
    return this.authService.refreshToken(req.user);
  }
}
