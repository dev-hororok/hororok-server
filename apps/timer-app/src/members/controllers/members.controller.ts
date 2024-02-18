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
import { StudyRecordsService } from '../../study-records/study-records.service';
import { CharacterInventoryService } from '../../character-inventory/character-inventory.service';
import { ItemInventoryService } from '../../item-inventory/item-inventory.service';
import { MemberInitializationService } from '../services/member-initialization.service';
import { IsNull, MoreThan, Not } from 'typeorm';
import { MemberMapper } from '../../database/mappers/member.mapper';
import { StudyStreakMapper } from '../../database/mappers/study-streak.mapper';
import { ItemInventoryMapper } from '../../database/mappers/item-inventory.mapper';
import { CharacterInventoryMapper } from '../../database/mappers/character-inventory.mapper';
import { StudyRecordMapper } from '../../database/mappers/study-record.mapper';
import { JwtPayloadType } from '../../auth/strategies/types/jwt-payload';
import { RoleEnum } from '../../roles/roles.enum';
import { Roles } from '../../roles/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@Controller('members')
export class MembersController {
  constructor(
    private readonly membersService: MembersService,
    private readonly memberInitializationService: MemberInitializationService,
    private readonly streaksService: StreaksService,
    private readonly itemInventoryService: ItemInventoryService,
    private readonly characterInventoryService: CharacterInventoryService,
    private readonly studyRecordsService: StudyRecordsService,
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
      !updateMemberInputDto.nicknmae &&
      updateMemberInputDto.image_url === undefined
    ) {
      throw new BadRequestException('변경할 내용이 없습니다.');
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
    @Query('item_type') itemType: string,
  ) {
    const item_inventory = await this.itemInventoryService.findAll({
      where: {
        member: {
          member_id: memberId,
        },
        quantity: MoreThan(0),
        item_type: itemType,
      },
      relations: {
        item: true,
      },
    });

    return {
      item_inventory: item_inventory.map((itemInventory) =>
        ItemInventoryMapper.toDomain(itemInventory),
      ),
    };
  }

  // 유저 캐릭터 인벤토리 조회
  @Get(':member_id/character-inventory')
  @UseGuards(PermissionsGuard)
  async getMemberCharacterInventory(@Param('member_id') memberId: string) {
    const character_inventory = await this.characterInventoryService.findAll({
      where: { member: { member_id: memberId }, quantity: MoreThan(0) },
      relations: {
        character: true,
      },
    });

    return {
      character_inventory: character_inventory.map((ci) =>
        CharacterInventoryMapper.toDomain(ci),
      ),
    };
  }

  // 유저 공부 기록들 조회
  @Get(':member_id/study-records')
  @UseGuards(MemberExistsGuard)
  async getMemberStudyRecords(@Param('member_id') memberId: string) {
    const study_records = await this.studyRecordsService.findAll({
      where: {
        member: {
          member_id: memberId,
        },
        end_time: Not(IsNull()),
      },
      relations: { study_category: true },
    });
    return {
      study_records: study_records.map((sr) => StudyRecordMapper.toDomain(sr)),
    };
  }
}
