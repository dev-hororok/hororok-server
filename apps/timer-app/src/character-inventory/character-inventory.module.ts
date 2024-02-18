import { Module } from '@nestjs/common';
import { CharacterInventoryService } from './character-inventory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacterInventoryEntity } from '../database/entities/character-inventory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CharacterInventoryEntity])],
  providers: [CharacterInventoryService],
  exports: [CharacterInventoryService],
})
export class CharacterInventoryModule {}
