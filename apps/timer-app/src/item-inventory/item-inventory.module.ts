import { Module } from '@nestjs/common';
import { ItemInventoryService } from './item-inventory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemInventoryEntity } from '../database/entities/item-inventory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ItemInventoryEntity])],
  providers: [ItemInventoryService],
  exports: [ItemInventoryService],
})
export class ItemInventoryModule {}
