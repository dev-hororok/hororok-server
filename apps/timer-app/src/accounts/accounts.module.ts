import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { TypeormAccountModule } from './infrastructure/typeorm/typeorm-account.module';
import { AccountsController } from './accounts.controller';

@Module({
  imports: [TypeormAccountModule],
  controllers: [AccountsController],
  providers: [AccountsService],
  exports: [AccountsService, TypeormAccountModule],
})
export class AccountsModule {}
