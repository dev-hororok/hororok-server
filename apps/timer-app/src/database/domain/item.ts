import { Exclude, Expose } from 'class-transformer';
import { ItemInventory } from './item-inventory';

export class Item {
  item_id: number;
  name: string;
  item_type: string; // Food, Consumable
  description: string;
  required_study_time: number | null;
  cost: number;
  grade: string | null;
  image_url: string;
  is_hidden: boolean; // 상점에 보이는 여부
  item_inventories?: ItemInventory[];

  @Exclude({ toPlainOnly: true })
  effect_code: number; // 음식사용(10000번대), 사용아이템(20000번대)

  @Expose({ groups: ['admin'] })
  created_at: Date;
  @Expose({ groups: ['admin'] })
  updated_at: Date;
  @Expose({ groups: ['admin'] })
  deleted_at: Date;
}
