import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MemberEntity } from '../../entities/member.entity';
import { MemberSeedService } from './members.seed.service';
import { AccountEntity } from '../../entities/account.entity';
import { StudyStreakEntity } from '../../entities/study-streak.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MemberEntity, AccountEntity, StudyStreakEntity]),
  ],
  providers: [MemberSeedService],
  exports: [MemberSeedService],
})
export class MemberSeedModule {}
