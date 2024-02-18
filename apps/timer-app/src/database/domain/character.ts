import { CharacterInventory } from './character-inventory';

export class Character {
  character_id: number;
  name: string;
  description: string | null;
  grade: string;
  image_url: string;
  sell_price: number;
  character_inventories?: CharacterInventory[];

  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}
