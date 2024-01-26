import { CharacterInventory } from '@app/database/typeorm/entities/character-inventory.entity';
import { DataSource } from 'typeorm';

export const CharacterInventoryProviders = [
  {
    provide: 'CHARACTER_INVENTORY_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(CharacterInventory),
    inject: ['DATA_SOURCE'],
  },
];
