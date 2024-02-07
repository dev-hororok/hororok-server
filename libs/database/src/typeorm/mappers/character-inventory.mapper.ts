import { ReadOnlyCharacterInventoryDto } from '../dtos/readonly-character-inventory.dto';
import { CharacterInventory } from '../entities/character-inventory.entity';
import { CharacterMapper } from './character.mapper';

export class CharacterInventoryMapper {
  static toDto(
    character_inventory: CharacterInventory,
  ): ReadOnlyCharacterInventoryDto {
    const dto = new ReadOnlyCharacterInventoryDto();

    dto.character_inventory_id = character_inventory.character_inventory_id;
    dto.quantity = character_inventory.quantity;
    dto.character = CharacterMapper.toDto(character_inventory.character);

    return dto;
  }
}
