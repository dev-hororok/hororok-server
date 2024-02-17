import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountTypeormRepository } from './repositories/account.repository';
import { AccountRepository } from '../accounts.repository';
import { AccountEntity } from './entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccountEntity])],
  providers: [
    {
      provide: AccountRepository,
      useClass: AccountTypeormRepository,
    },
  ],
  exports: [AccountRepository],
})
export class TypeormAccountModule {}
