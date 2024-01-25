import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { DatabaseModule } from '@app/database';
import { MembersProviders } from './members.providers';

@Module({
  imports: [DatabaseModule],
  providers: [...MembersProviders, MembersService],
  controllers: [MembersController],
})
export class MembersModule {}
