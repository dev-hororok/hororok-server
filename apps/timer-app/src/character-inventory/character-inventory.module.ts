import { Module } from '@nestjs/common';
import { CharacterInventoryService } from './character-inventory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacterInventory } from '../database/entities/character-inventory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CharacterInventory])],
  providers: [CharacterInventoryService],
  exports: [CharacterInventoryService],
})
export class CharacterInventoryModule {}
