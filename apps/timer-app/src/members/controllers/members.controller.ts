import { StreaksService } from '../../streaks/streaks.service';
import { Roles } from '@app/auth';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MembersService } from '../services/members.service';
import { MemberMapper } from '@app/database/typeorm/mappers/member.mapper';
import { AccountRole } from '@app/database/common/enums/account-role.enum';
import { UpdateMemberInputDto } from '../dtos/update-member.dto';
import { PermissionsGuard } from '../guards/permissions.guard';
import { StudyStreakMapper } from '@app/database/typeorm/mappers/study-streak.mapper';
import { MemberExistsGuard } from '../guards/exists.guard';
import { StudyRecordsService } from '../../study-records/study-records.service';
import { StudyRecordMapper } from '@app/database/typeorm/mappers/study-record.mapper';
import { CharacterInventoryService } from '../../character-inventory/character-inventory.service';
import { CharacterInventoryMapper } from '@app/database/typeorm/mappers/character-inventory.mapper';
import { ItemInventoryService } from '../../item-inventory/item-inventory.service';
import { ItemInventoryMapper } from '@app/database/typeorm/mappers/item-inventory.mapper';
import { MemberInitializationService } from '../services/member-initialization.service';
import { IsNull, Not } from 'typeorm';

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

  @Roles(AccountRole.ADMIN)
  @Get()
  async getAllMember() {
    const members = await this.membersService.findAll();
    return { members: members };
  }

  // 로그인 된 계정의 유저를 조회 (없으면 새로 생성)
  @Get('me')
  async getCurrentMember(@Req() req) {
    let member = await this.membersService.findOne({
      where: {
        account_id: req.user.sub,
      },
    });
    if (!member) {
      member = await this.memberInitializationService.initializeMember(
        req.user,
      );
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
    await this.membersService.update(member_id, updateMemberInputDto);
    return null;
  }

  // 유저 스트릭 정보 조회 (없으면 생성)
  @Get(':member_id/study-streak')
  @UseGuards(MemberExistsGuard)
  async getMemberStudyStreak(@Param('member_id') member_id: string) {
    const streak = await this.streaksService.findOrCreate(member_id);

    return StudyStreakMapper.toDto(streak);
  }

  // 유저 아이템 인벤토리 조회
  @Get(':member_id/item-inventory')
  @UseGuards(PermissionsGuard)
  async getMemberItemInventory(
    @Param('member_id') member_id: string,
    @Query('item_type') item_type: string,
  ) {
    const item_inventory = await this.itemInventoryService.findAll({
      where: {
        member: {
          member_id,
        },
        item_type,
      },
      relations: {
        item: true,
      },
    });

    return {
      item_inventory: item_inventory.map((itemInventory) =>
        ItemInventoryMapper.toDto(itemInventory),
      ),
    };
  }

  // 유저 캐릭터 인벤토리 조회
  @Get(':member_id/character-inventory')
  @UseGuards(PermissionsGuard)
  async getMemberCharacterInventory(@Param('member_id') member_id: string) {
    const character_inventory = await this.characterInventoryService.findAll({
      where: { member: { member_id } },
      relations: {
        character: true,
      },
    });

    return {
      character_inventory: character_inventory.map((ci) =>
        CharacterInventoryMapper.toDto(ci),
      ),
    };
  }

  // 유저 공부 기록들 조회
  @Get(':member_id/study-records')
  @UseGuards(MemberExistsGuard)
  async getMemberStudyRecords(@Param('member_id') member_id: string) {
    const study_records = await this.studyRecordsService.findAll({
      where: {
        member: {
          member_id,
        },
        end_time: Not(IsNull()),
      },
      relations: { study_category: true },
    });
    return {
      study_records: study_records.map((sr) => StudyRecordMapper.toDto(sr)),
    };
  }
}
