import { Character } from './character';
import { Member } from './member';

export class CharacterInventory {
  character_inventory_id: number;
  quantity: number;
  character?: Character;
  member?: Member;

  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}
