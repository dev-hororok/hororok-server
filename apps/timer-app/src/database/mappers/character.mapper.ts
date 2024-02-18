import { Character } from '../domain/character';
import { CharacterEntity } from '../entities/character.entity';

export class CharacterMapper {
  static toDomain(raw: CharacterEntity): Character {
    const character = new Character();

    character.character_id = raw.character_id;
    character.name = raw.name;
    character.description = raw.description;
    character.sell_price = raw.sell_price;
    character.image_url = raw.image_url;
    character.grade = raw.grade;
    if (raw.character_inventories) {
      character.character_inventories = raw.character_inventories; // mapper
    }
    character.created_at = raw.created_at;
    character.updated_at = raw.updated_at;
    character.deleted_at = raw.deleted_at;

    return character;
  }
}
