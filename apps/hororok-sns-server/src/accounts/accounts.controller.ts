import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Request,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { EditAccountDto } from './dtos/edit-account.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}
  @Get('me')
  async getLoggedInAccount(@Request() req) {
    const account = await this.accountsService.findOneById(req.user.sub);
    return account;
  }

  @Patch(':account_id')
  async editAccount(
    @Param('account_id') account_id: string,
    @Request() req,
    @Body() editAccountDto: EditAccountDto,
  ) {
    if (req.user.sub !== account_id) {
      throw new ForbiddenException();
    }

    if (!editAccountDto.name && !editAccountDto.profile_url) {
      throw new BadRequestException('변경된 내용이 없습니다.');
    }
    const account = await this.accountsService.update(
      account_id,
      editAccountDto,
    );
    return account;
  }

  @Patch(':account_id/change-password')
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
    return account;
  }
}
