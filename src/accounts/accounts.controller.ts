import { Controller, Get, Request } from '@nestjs/common';
import { AccountsService } from './accounts.service';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}
  @Get('profile')
  async getProfile(@Request() req) {
    const account = await this.accountsService.findOneById(req.user.sub);
    return account.readOnlyData;
  }
}
