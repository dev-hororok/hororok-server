import { Module } from '@nestjs/common';
import { CharacterInventoryService } from './character-inventory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacterInventoryEntity } from '../database/entities/character-inventory.entity';
import { CharacterInventoryRepository } from './repositories/character-inventory.repository.interface';
import { TypeOrmCharacterInventoryRepository } from './repositories/typeorm/character-inventory.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CharacterInventoryEntity])],
  providers: [
    CharacterInventoryService,
    {
      provide: CharacterInventoryRepository,
      useClass: TypeOrmCharacterInventoryRepository,
    },
  ],
  exports: [CharacterInventoryService],
})
export class CharacterInventoryModule {}
