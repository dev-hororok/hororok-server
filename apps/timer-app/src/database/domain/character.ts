import { Expose } from 'class-transformer';
import { CharacterInventory } from './character-inventory';

export class Character {
  character_id: number;
  name: string;
  description: string | null;
  grade: string;
  image_url: string;
  sell_price: number;
  character_inventories?: CharacterInventory[];

  @Expose({ groups: ['admin'] })
  created_at: Date;
  @Expose({ groups: ['admin'] })
  updated_at: Date;
  @Expose({ groups: ['admin'] })
  deleted_at: Date;
}
