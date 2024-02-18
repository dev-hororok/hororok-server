import { ItemInventory } from '../domain/item-inventory';
import { ItemInventoryEntity } from '../entities/item-inventory.entity';
import { ItemEntity } from '../entities/item.entity';
import { MemberEntity } from '../entities/member.entity';
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
  static toPersistence(itemInventory: ItemInventory): ItemInventoryEntity {
    let member: MemberEntity | undefined = undefined;

    if (itemInventory.member) {
      member = new MemberEntity();
      member.member_id = itemInventory.member.member_id;
    }

    let item: ItemEntity | undefined = undefined;

    if (itemInventory.item) {
      item = new ItemEntity();
      item.item_id = itemInventory.item.item_id;
    }

    const itemInventoryEntity = new ItemInventoryEntity();

    itemInventoryEntity.item_inventory_id = itemInventory.item_inventory_id;
    itemInventoryEntity.progress = itemInventory.progress;
    itemInventoryEntity.quantity = itemInventory.quantity;
    itemInventoryEntity.item_type = itemInventory.item_type;

    itemInventoryEntity.member = member;
    itemInventoryEntity.item = item;

    itemInventoryEntity.created_at = itemInventory.created_at;
    itemInventoryEntity.updated_at = itemInventory.updated_at;
    itemInventoryEntity.deleted_at = itemInventory.deleted_at;
    return itemInventoryEntity;
  }
}
