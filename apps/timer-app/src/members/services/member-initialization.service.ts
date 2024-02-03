import { StreaksService } from './../../streaks/streaks.service';
import { JWTPayload } from '@app/auth';
import { Member } from '@app/database/typeorm/entities/member.entity';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { MembersService } from './members.service';

@Injectable()
export class MemberInitializationService {
  constructor(
    private membersService: MembersService,
    private streaksService: StreaksService,
    private dataSource: DataSource,
  ) {}

  async initializeMember(jwtToken: JWTPayload): Promise<Member> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newMember = await this.membersService.create(jwtToken, queryRunner);
      await this.streaksService.create(newMember.member_id, queryRunner);
      await queryRunner.commitTransaction();

      return newMember;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
