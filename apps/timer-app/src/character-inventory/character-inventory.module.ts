import { Module } from '@nestjs/common';
import { CharacterInventoryService } from './character-inventory.service';
import { CharacterInventoryProviders } from './character-inventory.providers';
import { DatabaseModule } from '@app/database';

@Module({
  imports: [DatabaseModule],
  providers: [...CharacterInventoryProviders, CharacterInventoryService],
  exports: [CharacterInventoryService],
})
export class CharacterInventoryModule {}
