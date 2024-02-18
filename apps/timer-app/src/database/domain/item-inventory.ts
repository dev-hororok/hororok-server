import { Item } from './item';
import { Member } from './member';

export class ItemInventory {
  item_inventory_id: number;
  progress: number | null;
  quantity: number;
  item_type: string; // Food, Consumable
  item?: Item;
  member?: Member;

  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}
