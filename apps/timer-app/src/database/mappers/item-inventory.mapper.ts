import { ItemInventory } from '../domain/item-inventory';
import { ItemInventoryEntity } from '../entities/item-inventory.entity';
import { ItemMapper } from './item.mapper';
import { MemberMapper } from './member.mapper';

export class ItemInventoryMapper {
  static toDomain(raw: ItemInventoryEntity): ItemInventory {
    const itemInventory = new ItemInventory();

    itemInventory.item_inventory_id = raw.item_inventory_id;
    itemInventory.progress = raw.progress;
    itemInventory.quantity = raw.quantity;
    itemInventory.item_type = raw.item_type;

    if (raw.item) {
      itemInventory.item = ItemMapper.toDomain(raw.item);
    }
    if (raw.member) {
      itemInventory.member = MemberMapper.toDomain(raw.member);
    }

    itemInventory.created_at = raw.created_at;
    itemInventory.updated_at = raw.updated_at;
    itemInventory.deleted_at = raw.deleted_at;
    return itemInventory;
  }
}
