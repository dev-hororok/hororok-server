import { CharacterInventory } from '../domain/character-inventory';
import { CharacterInventoryEntity } from '../entities/character-inventory.entity';
import { CharacterMapper } from './character.mapper';
import { MemberMapper } from './member.mapper';

export class CharacterInventoryMapper {
  static toDomain(raw: CharacterInventoryEntity): CharacterInventory {
    const characterInventory = new CharacterInventory();

    characterInventory.character_inventory_id = raw.character_inventory_id;
    characterInventory.quantity = raw.quantity;
    if (raw.character) {
      characterInventory.character = CharacterMapper.toDomain(raw.character);
    }
    if (raw.member) {
      characterInventory.member = MemberMapper.toDomain(raw.member);
    }
    characterInventory.created_at = raw.created_at;
    characterInventory.updated_at = raw.updated_at;
    characterInventory.deleted_at = raw.deleted_at;
    return characterInventory;
  }
}
