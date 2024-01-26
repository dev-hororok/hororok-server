import { EggInventory } from '@app/database/typeorm/entities/egg-inventory.entity';
import { DataSource } from 'typeorm';

export const EggInventoryProviders = [
  {
    provide: 'EGG_INVENTORY_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(EggInventory),
    inject: ['DATA_SOURCE'],
  },
];
