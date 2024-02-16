import { StreaksService } from './../../streaks/streaks.service';
import { JWTPayload } from '@app/auth';
import { Injectable } from '@nestjs/common';
import { MembersService } from './members.service';
import { TransactionService } from '../../common/transaction.service';
import { Member } from '../../database/entities/member.entity';

@Injectable()
export class MemberInitializationService {
  constructor(
    private membersService: MembersService,
    private streaksService: StreaksService,

    private transactionService: TransactionService,
  ) {}

  /** 멤버 초기화(계정으로 첫 접속할 시 멤버객체 생성) */
  async initializeMember(jwtToken: JWTPayload): Promise<Member> {
    return this.transactionService.executeInTransaction(async (queryRunner) => {
      const newMember = await this.membersService.create(jwtToken, queryRunner);
      await this.streaksService.create(newMember.member_id, queryRunner);
      return newMember;
    });
  }
}
