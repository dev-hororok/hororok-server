import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { ChangePasswordDto } from './dtos/change-password.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}
  @Get('me')
  async getProfile(@Request() req) {
    const account = await this.accountsService.findOneById(req.user.sub);
    return account.readOnlyData;
  }

  @Post(':account_id/change-password')
  async changePassword(
    @Param('account_id') account_id: string,
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    if (req.user.sub !== account_id) {
      throw new ForbiddenException();
    }
    const account = await this.accountsService.changePassword(
      account_id,
      changePasswordDto,
    );
    return account.readOnlyData;
  }
}
