import { StreaksService } from './../streaks/streaks.service';
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
import { StudyStreakMapper } from '@app/database/typeorm/mappers/study-streak.mapper';
import { MemberExistsGuard } from './guards/exists.guard';
import { EggInventoryService } from '../egg-inventory/egg-inventory.service';
import { EggInventoryMapper } from '@app/database/typeorm/mappers/egg-inventory.mapper';
import { StudyRecordsService } from '../study-records/study-records.service';
import { StudyRecordMapper } from '@app/database/typeorm/mappers/study-record.mapper';
import { StatisticsService } from '../statistics/statistics.service';
import { StatisticMapper } from '@app/database/typeorm/mappers/statistic.mapper';
import { CharacterInventoryService } from '../character-inventory/character-inventory.service';
import { CharacterInventoryMapper } from '@app/database/typeorm/mappers/character-inventory.mapper';

@Controller('members')
export class MembersController {
  constructor(
    private readonly membersService: MembersService,
    private readonly streaksService: StreaksService,
    private readonly eggInventoryService: EggInventoryService,
    private readonly characterInventoryService: CharacterInventoryService,
    private readonly studyRecordsService: StudyRecordsService,
    private readonly statisticsService: StatisticsService,
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
    const member = await this.membersService.findOneByAccountId(req.user.sub);

    if (!member) {
      const newMember = await this.membersService.create(req.user);
      // 스트릭 생성
      await this.streaksService.create(newMember.member_id);

      // 통계 생성
      await this.statisticsService.create(newMember.member_id);

      return { member: MemberMapper.toDto(newMember) };
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

    return { member: MemberMapper.toDto(updatedMember) };
  }

  // 유저 스트릭 정보 조회 (없으면 생성)
  @Get(':member_id/study-streak')
  @UseGuards(MemberExistsGuard)
  async getMemberStudyStreak(@Param('member_id') member_id: string) {
    const streak = await this.streaksService.findOneByMemberId(member_id);

    if (!streak) {
      const newStreak = await this.streaksService.create(member_id);
      return StudyStreakMapper.toDto(newStreak);
    }

    return StudyStreakMapper.toDto(streak);
  }

  // 유저 알 인벤토리 조회
  @Get(':member_id/egg-inventory')
  @UseGuards(PermissionsGuard)
  async getMemberEggInventory(@Param('member_id') member_id: string) {
    const egg_inventory =
      await this.eggInventoryService.findByMemberId(member_id);

    return {
      egg_inventory: egg_inventory.map((ei) => EggInventoryMapper.toDto(ei)),
    };
  }

  // 유저 캐릭터 인벤토리 조회
  @Get(':member_id/character-inventory')
  @UseGuards(PermissionsGuard)
  async getMemberCharacterInventory(@Param('member_id') member_id: string) {
    const character_inventory =
      await this.characterInventoryService.findByMemberId(member_id);

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
    const study_records =
      await this.studyRecordsService.findByMemberId(member_id);

    return {
      study_records: study_records.map((sr) => StudyRecordMapper.toDto(sr)),
    };
  }

  // 유저 통계 조회 (없으면 생성)
  @Get(':member_id/statistic')
  @UseGuards(PermissionsGuard)
  async getMemberStatistic(@Param('member_id') member_id: string) {
    const statistic = await this.statisticsService.findOneByMemberId(member_id);

    if (!statistic) {
      const newStatistic = await this.statisticsService.create(member_id);
      return { statistic: StatisticMapper.toDto(newStatistic) };
    }
    return {
      statistic: StatisticMapper.toDto(statistic),
    };
  }
}
