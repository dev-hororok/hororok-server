import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { StreaksModule } from '../streaks/streaks.module';
import { EggInventoryModule } from '../egg-inventory/egg-inventory.module';
import { StudyRecordsModule } from '../study-records/study-records.module';
import { CharacterInventoryModule } from '../character-inventory/character-inventory.module';
import { StudyCategoriesModule } from '../study-categories/study-categories.module';
import { MemberStudyCategoriesController } from './members-study-categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '@app/database/typeorm/entities/member.entity';
import { ItemInventoryModule } from '../item-inventory/item-inventory.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member]),
    StreaksModule,
    EggInventoryModule,
    CharacterInventoryModule,
    ItemInventoryModule,
    StudyRecordsModule,
    StudyCategoriesModule,
  ],
  providers: [MembersService],
  controllers: [MembersController, MemberStudyCategoriesController],
  exports: [MembersService],
})
export class MembersModule {}
