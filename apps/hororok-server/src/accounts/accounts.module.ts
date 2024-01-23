import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { accountsProviders } from './accounts.providers';
import { AccountsRepository } from './accounts.repository';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [AccountsService, AccountsRepository, ...accountsProviders],
  controllers: [AccountsController],
  exports: [AccountsService],
})
export class AccountsModule {}
