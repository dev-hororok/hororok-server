import { Module } from '@nestjs/common';
import { EggInventoryService } from './egg-inventory.service';
import { EggInventoryProviders } from './egg-inventory.providers';
import { DatabaseModule } from '@app/database';

@Module({
  imports: [DatabaseModule],
  providers: [...EggInventoryProviders, EggInventoryService],
  exports: [EggInventoryService],
})
export class EggInventoryModule {}
