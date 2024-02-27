import { StreaksService } from '../../streaks/streaks.service';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MembersService } from '../services/members.service';
import { UpdateMemberInputDto } from '../dtos/update-member.dto';
import { PermissionsGuard } from '../guards/permissions.guard';
import { MemberExistsGuard } from '../guards/exists.guard';
import { CharacterInventoryService } from '../../character-inventory/character-inventory.service';
import { ItemInventoryService } from '../../item-inventory/item-inventory.service';
import { MemberInitializationService } from '../services/member-initialization.service';
import { MemberMapper } from '../../database/mappers/member.mapper';
import { StudyStreakMapper } from '../../database/mappers/study-streak.mapper';
import { JwtPayloadType } from '../../auth/strategies/types/jwt-payload';
import { RoleEnum } from '../../roles/roles.enum';
import { Roles } from '../../roles/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { ItemInventoryQueryDto } from '../../item-inventory/dto/item-inventory-query.dto';
import { STATUS_MESSAGES } from '../../utils/constants';

@Controller('members')
export class MembersController {
  constructor(
    private readonly membersService: MembersService,
    private readonly memberInitializationService: MemberInitializationService,
    private readonly streaksService: StreaksService,
    private readonly itemInventoryService: ItemInventoryService,
    private readonly characterInventoryService: CharacterInventoryService,
  ) {}

  @Roles(RoleEnum.admin)
  @Get()
  async getAllMember() {
    const members = await this.membersService.findAll();
    return { members: members };
  }

  // 로그인 된 계정의 유저를 조회 (없으면 새로 생성)
  @Get('me')
  async getCurrentMember(@CurrentUser() user: JwtPayloadType) {
    let member = await this.membersService.findOneByAccountId(user.sub);
    if (!member) {
      member = await this.memberInitializationService.initializeMember(user);
    }

    return { member: MemberMapper.toDomain(member) };
  }

  // 유저 정보 수정
  @Patch(':member_id')
  @UseGuards(PermissionsGuard)
  async updateMember(
    @Param('member_id') memberId: string,
    @Body() updateMemberInputDto: UpdateMemberInputDto,
  ) {
    if (
      updateMemberInputDto.nickname === undefined &&
      updateMemberInputDto.image_url === undefined &&
      updateMemberInputDto.status_message === undefined
    ) {
      throw new BadRequestException(STATUS_MESSAGES.VALIDATION.NO_CONTENT);
    }
    await this.membersService.update(memberId, updateMemberInputDto);
    return null;
  }

  // 유저 스트릭 정보 조회 (없으면 생성)
  @Get(':member_id/study-streak')
  @UseGuards(MemberExistsGuard)
  async getMemberStudyStreak(@Param('member_id') memberId: string) {
    const streak = await this.streaksService.findOrCreate(memberId);

    return StudyStreakMapper.toDomain(streak);
  }

  // 유저 아이템 인벤토리 조회
  @Get(':member_id/item-inventory')
  @UseGuards(PermissionsGuard)
  async getMemberItemInventory(
    @Param('member_id') memberId: string,
    @Query() queryDto: ItemInventoryQueryDto,
  ) {
    const item_inventory = await this.itemInventoryService.getMemeberInventory(
      memberId,
      queryDto.item_type,
    );

    return {
      item_inventory,
    };
  }

  // 유저 캐릭터 인벤토리 조회
  @Get(':member_id/character-inventory')
  @UseGuards(PermissionsGuard)
  async getMemberCharacterInventory(@Param('member_id') memberId: string) {
    const character_inventory =
      await this.characterInventoryService.getMemeberInventory(memberId);

    return {
      character_inventory,
    };
  }
}
