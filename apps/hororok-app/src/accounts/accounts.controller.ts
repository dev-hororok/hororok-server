import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { EditAccountDto } from './dtos/edit-account.dto';
import { AccountMapper } from '@app/database/mongodb/mappers/account.mapper';
import { ReadOnlyAccountDto } from '@app/database/mongodb/dtos/readonly-account.dto';
import { CurrentUser } from '@app/auth/decorators/current-user.decorator';
import { JWTPayload } from '@app/auth';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get('me')
  async getLoggedInAccount(
    @CurrentUser() user: JWTPayload,
  ): Promise<ReadOnlyAccountDto> {
    const account = await this.accountsService.findOneById(user.sub);
    if (!account) {
      throw new NotFoundException('계정이 존재하지 않습니다.');
    }
    return AccountMapper.toDto(account);
  }

  @Patch(':account_id')
  async editAccount(
    @Param('account_id') account_id: string,
    @CurrentUser() user: JWTPayload,
    @Body() editAccountDto: EditAccountDto,
  ): Promise<ReadOnlyAccountDto> {
    if (user.sub !== account_id) {
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

  @Patch(':account_id/change-password')
  async changePassword(
    @Param('account_id') account_id: string,
    @CurrentUser() user: JWTPayload,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<ReadOnlyAccountDto> {
    if (user.sub !== account_id) {
      throw new ForbiddenException();
    }
    const account = await this.accountsService.changePassword(
      account_id,
      changePasswordDto,
    );
    return AccountMapper.toDto(account);
  }
}
