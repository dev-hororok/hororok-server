import { Expose } from 'class-transformer';
import { Item } from './item';
import { Member } from './member';

export class ItemInventory {
  item_inventory_id: number;
  progress: number | null;
  quantity: number;
  item_type: string; // Food, Consumable
  item?: Item;
  member?: Member;

  @Expose({ groups: ['admin'] })
  created_at: Date;
  @Expose({ groups: ['admin'] })
  updated_at: Date;
  @Expose({ groups: ['admin'] })
  deleted_at: Date;
}
