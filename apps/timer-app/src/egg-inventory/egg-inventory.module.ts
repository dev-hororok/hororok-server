import { Module } from '@nestjs/common';
import { EggInventoryService } from './egg-inventory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EggInventory } from '@app/database/typeorm/entities/egg-inventory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EggInventory])],
  providers: [EggInventoryService],
  exports: [EggInventoryService],
})
export class EggInventoryModule {}
