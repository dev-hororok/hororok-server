import { ReadOnlyCharacterDto } from '../dtos/readonly-character.dto';
import { Character } from '../entities/character.entity';

export class CharacterMapper {
  static toDto(character: Character): ReadOnlyCharacterDto {
    const dto = new ReadOnlyCharacterDto();

    dto.character_id = character.character_id;
    dto.name = character.name;
    dto.description = character.description;
    dto.sell_price = character.sell_price;
    dto.image_url = character.image_url;
    dto.grade = character.grade;

    return dto;
  }
}
