import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { EditAccountDto } from './dtos/edit-account.dto';
import { ReadOnlyAccountDto } from '@app/database/mongoose/dtos/readonly-account.dto';
import { AccountMapper } from '@app/database/mongoose/mappers/account.mapper';
import { JwtAuthGuard } from '@app/auth';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getLoggedInAccount(@Request() req): Promise<ReadOnlyAccountDto> {
    const account = await this.accountsService.findOneById(req.user.sub);
    return AccountMapper.toDto(account);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':account_id')
  async editAccount(
    @Param('account_id') account_id: string,
    @Request() req,
    @Body() editAccountDto: EditAccountDto,
  ): Promise<ReadOnlyAccountDto> {
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
    return AccountMapper.toDto(account);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':account_id/change-password')
  async changePassword(
    @Param('account_id') account_id: string,
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<ReadOnlyAccountDto> {
    if (req.user.sub !== account_id) {
      throw new ForbiddenException();
    }
    const account = await this.accountsService.changePassword(
      account_id,
      changePasswordDto,
    );
    return AccountMapper.toDto(account);
  }
}
