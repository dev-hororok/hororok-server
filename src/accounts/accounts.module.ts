import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { DatabaseModule } from '@src/database/database.module';
import { accountsProviders } from './accounts.providers';
import { AccountsRepository } from './accounts.repository';

@Module({
  imports: [DatabaseModule],
  providers: [AccountsService, AccountsRepository, ...accountsProviders],
  controllers: [AccountsController],
  exports: [AccountsService],
})
export class AccountsModule {}
