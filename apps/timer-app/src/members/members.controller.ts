import { Roles } from '@app/auth';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { MemberMapper } from '@app/database/typeorm/mappers/member.mapper';
import { AccountRole } from '@app/database/common/enums/account-role.enum';
import { UpdateMemberInputDto } from './dtos/update-member.dto';
import { PermissionsGuard } from './guards/permissions.guard';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Roles(AccountRole.ADMIN)
  @Get()
  async getAllMember() {
    const members = await this.membersService.findAll();
    return { members: members };
  }

  // 로그인 된 계정의 유저를 조회 (없으면 새로 생성)
  @Get('me')
  async getCurrentMember(@Req() req) {
    const member = await this.membersService.findOneByAccountId(req.user.sub);

    if (!member) {
      const newMember = await this.membersService.create(req.user);

      return MemberMapper.toDto(newMember);
    }

    return { member: MemberMapper.toDto(member) };
  }

  // 유저 정보 수정
  @Patch(':member_id')
  @UseGuards(PermissionsGuard)
  async updateMember(
    @Param('member_id') member_id: string,
    @Body() updateMemberInputDto: UpdateMemberInputDto,
  ) {
    if (
      !updateMemberInputDto.nicknmae &&
      updateMemberInputDto.image_url === undefined
    ) {
      throw new BadRequestException('변경할 내용이 없습니다.');
    }

    const updatedMember = await this.membersService.update(
      member_id,
      updateMemberInputDto,
    );

    return { member: updatedMember };
  }
}
