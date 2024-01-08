import {
  Controller,
  Post,
  Get,
  Request,
  UseGuards,
  Body,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guard/local-auth.guard';
import { Public } from '../decorators/public.decorator';
import { CreateAccountDto } from '../dtos/create-account.dto';
import { JwtRefreshGuard } from '../guard/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    // node 관습상 인증된 정보는 request의 user에 담긴다
    return this.authService.login(req.user);
  }

  @Public()
  @Post('register')
  async registerAccount(@Body() body: CreateAccountDto) {
    return this.authService.registerAccount(body);
  }

  @Get('profile')
  getProfile(@Request() req) {
    console.log(req.user);
    return req.user;
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user);
  }
}
