import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MemberEntity } from '../../entities/member.entity';
import { CharacterInventoryEntity } from '../../entities/character-inventory.entity';
import { MemberCharacterCollectionEntity } from '../../entities/member-character-collection.entity';
import { MemberCharacterCollectionMigrateService } from './member-character-collection-migrate.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MemberEntity,
      CharacterInventoryEntity,
      MemberCharacterCollectionEntity,
    ]),
  ],
  providers: [MemberCharacterCollectionMigrateService],
  exports: [MemberCharacterCollectionMigrateService],
})
export class MemberCharacterCollectionMigrateModule {}
