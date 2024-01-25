import { Roles } from '@app/auth';
import { Controller, Get, Req } from '@nestjs/common';
import { MembersService } from './members.service';
import { MemberMapper } from '@app/database/typeorm/mappers/member.mapper';
import { AccountRole } from '@app/database/common/enums/account-role.enum';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Roles(AccountRole.ADMIN)
  @Get()
  async getAllMember() {
    const members = await this.membersService.findAll();
    return { members: members };
  }

  @Get('me')
  async getCurrentMember(@Req() req) {
    const member = await this.membersService.findOneByAccountId(req.user.sub);

    if (!member) {
      const newMember = await this.membersService.create(req.user);

      return MemberMapper.toDto(newMember);
    }

    return { member: MemberMapper.toDto(member) };
  }
}
