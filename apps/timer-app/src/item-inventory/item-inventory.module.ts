import { Module } from '@nestjs/common';
import { ItemInventoryService } from './item-inventory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemInventory } from '@app/database/typeorm/entities/item-inventory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ItemInventory])],
  providers: [ItemInventoryService],
  exports: [ItemInventoryService],
})
export class ItemInventoryModule {}
