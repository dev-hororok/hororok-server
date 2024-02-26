import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MemberEntity } from '../../entities/member.entity';
import { AccountSeeds } from '../seed';
import { AccountEntity } from '../../entities/account.entity';
import { StudyStreakEntity } from '../../entities/study-streak.entity';

@Injectable()
export class MemberSeedService {
  constructor(
    @InjectRepository(MemberEntity)
    private repository: Repository<MemberEntity>,
    @InjectRepository(AccountEntity)
    private accountRepository: Repository<AccountEntity>,
    @InjectRepository(StudyStreakEntity)
    private streakRepository: Repository<StudyStreakEntity>,
  ) {}

  async run() {
    for (const account of AccountSeeds) {
      const existAccount = await this.accountRepository.findOne({
        where: {
          email: account.email,
        },
      });
      if (!existAccount) continue;

      const countMember = await this.repository.count({
        where: {
          account: {
            account_id: existAccount.account_id,
          },
        },
      });
      if (countMember) continue;

      const newMember = await this.repository.save(
        this.repository.create({
          account: {
            account_id: existAccount.account_id,
          },
          status_message: '',
          nickname: account.member.nickname,
          image_url: '',
          point: 10000,
          active_record_id: null,
        }),
      );

      await this.streakRepository.save(
        this.streakRepository.create({
          member: { member_id: newMember.member_id },
          current_streak: 0,
          longest_streak: 0,
        }),
      );
    }
  }
}
