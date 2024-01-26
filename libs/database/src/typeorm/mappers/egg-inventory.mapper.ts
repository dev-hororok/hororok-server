import { ReadOnlyEggInventoryDto } from '../dtos/readonly-egg-inventory.dto';
import { EggInventory } from '../entities/egg-inventory.entity';
import { EggMapper } from './egg.mapper';

export class EggInventoryMapper {
  static toDto(egg_inventory: EggInventory): ReadOnlyEggInventoryDto {
    const dto = new ReadOnlyEggInventoryDto();

    dto.egg_inventory_id = egg_inventory.egg_inventory_id;
    dto.progress = egg_inventory.progress;
    dto.egg = EggMapper.toDto(egg_inventory.egg);

    return dto;
  }
}
