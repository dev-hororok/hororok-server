import { Expose } from 'class-transformer';
import { Character } from './character';
import { Member } from './member';

export class CharacterInventory {
  character_inventory_id: number;
  quantity: number;
  character?: Character;
  member?: Member;

  @Expose({ groups: ['admin'] })
  created_at: Date;
  @Expose({ groups: ['admin'] })
  updated_at: Date;
  @Expose({ groups: ['admin'] })
  deleted_at: Date;
}
