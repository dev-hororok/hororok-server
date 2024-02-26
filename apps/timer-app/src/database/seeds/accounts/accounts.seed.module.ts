import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountEntity } from '../../entities/account.entity';
import { AccountSeedService } from './accounts.seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([AccountEntity])],
  providers: [AccountSeedService],
  exports: [AccountSeedService],
})
export class AccountSeedModule {}
