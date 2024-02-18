import { CharacterInventory } from '../domain/character-inventory';
import { CharacterInventoryEntity } from '../entities/character-inventory.entity';
import { CharacterMapper } from './character.mapper';
import { MemberMapper } from './member.mapper';
import { MemberEntity } from '../entities/member.entity';
import { CharacterEntity } from '../entities/character.entity';

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
  static toPersistence(
    characterInventory: CharacterInventory,
  ): CharacterInventoryEntity {
    let member: MemberEntity | undefined = undefined;

    if (characterInventory.member) {
      member = new MemberEntity();
      member.member_id = characterInventory.member.member_id;
    }

    let character: CharacterEntity | undefined = undefined;

    if (characterInventory.character) {
      character = new CharacterEntity();
      character.character_id = characterInventory.character.character_id;
    }

    const characterInventoryEntity = new CharacterInventoryEntity();

    characterInventoryEntity.character_inventory_id =
      characterInventory.character_inventory_id;
    characterInventoryEntity.quantity = characterInventory.quantity;

    characterInventoryEntity.member = member;
    characterInventoryEntity.character = character;

    characterInventoryEntity.created_at = characterInventory.created_at;
    characterInventoryEntity.updated_at = characterInventory.updated_at;
    characterInventoryEntity.deleted_at = characterInventory.deleted_at;
    return characterInventoryEntity;
  }
}
