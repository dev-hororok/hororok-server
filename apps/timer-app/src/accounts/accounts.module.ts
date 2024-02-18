import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from '../database/entities/account.entity';
import { TypeOrmAccountsRepository } from './repositories/typeorm/accounts.repository';
import { AccountsRepository } from './repositories/accounts.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([AccountEntity])],
  controllers: [AccountsController],
  providers: [
    AccountsService,
    {
      provide: AccountsRepository,
      useClass: TypeOrmAccountsRepository,
    },
  ],
  exports: [AccountsService],
})
export class AccountsModule {}
