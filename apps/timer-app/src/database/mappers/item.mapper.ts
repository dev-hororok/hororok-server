import { Item } from '../domain/item';
import { ItemEntity } from '../entities/item.entity';

export class ItemMapper {
  static toDomain(raw: ItemEntity): Item {
    const item = new Item();

    item.item_id = raw.item_id;
    item.item_type = raw.item_type;
    item.name = raw.name;
    item.description = raw.description;
    item.cost = raw.cost;
    item.effect_code = raw.effect_code;
    item.required_study_time = raw.required_study_time;
    item.image_url = raw.image_url;
    item.grade = raw.grade;
    item.is_hidden = raw.is_hidden;

    if (raw.item_inventories) {
      item.item_inventories = raw.item_inventories; // mapper
    }

    item.created_at = raw.created_at;
    item.updated_at = raw.updated_at;
    item.deleted_at = raw.deleted_at;

    return item;
  }
}
