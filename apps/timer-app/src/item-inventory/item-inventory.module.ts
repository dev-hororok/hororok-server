import { Module } from '@nestjs/common';
import { ItemInventoryService } from './item-inventory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemInventoryEntity } from '../database/entities/item-inventory.entity';
import { ItemInventoryRepository } from './repositories/item-inventory.repository.interface';
import { TypeOrmItemInventoryRepository } from './repositories/typeorm/item-inventory.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ItemInventoryEntity])],
  providers: [
    ItemInventoryService,
    {
      provide: ItemInventoryRepository,
      useClass: TypeOrmItemInventoryRepository,
    },
  ],
  exports: [ItemInventoryService],
})
export class ItemInventoryModule {}
