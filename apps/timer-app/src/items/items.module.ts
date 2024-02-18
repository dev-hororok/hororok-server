import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemEntity } from '../database/entities/item.entity';
import { ItemRepository } from './repositories/item.repository.interface';
import { TypeOrmItemRepository } from './repositories/typeorm/item.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ItemEntity])],
  controllers: [ItemsController],
  providers: [
    ItemsService,
    {
      provide: ItemRepository,
      useClass: TypeOrmItemRepository,
    },
  ],
})
export class ItemsModule {}
