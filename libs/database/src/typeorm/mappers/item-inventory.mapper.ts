import { ReadOnlyItemInventoryDto } from '../dtos/readonly-item-inventory.dto';
import { ItemInventory } from '../entities/item-inventory.entity';
import { ItemMapper } from './item.mapper';

export class ItemInventoryMapper {
  static toDto(item_inventory: ItemInventory): ReadOnlyItemInventoryDto {
    const dto = new ReadOnlyItemInventoryDto();

    dto.item_inventory_id = item_inventory.item_inventory_id;
    dto.progress = item_inventory.progress;
    dto.quantity = item_inventory.quantity;
    dto.item_type = item_inventory.item_type;
    dto.item = ItemMapper.toDto(item_inventory.item);

    return dto;
  }
}
