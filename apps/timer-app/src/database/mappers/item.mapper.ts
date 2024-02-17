import { ReadOnlyItemDto } from '../dtos/readonly-item.dto';
import { Item } from '../entities/item.entity';

export class ItemMapper {
  static toDto(item: Item): ReadOnlyItemDto {
    const dto = new ReadOnlyItemDto();

    dto.item_id = item.item_id;
    dto.item_type = item.item_type;
    dto.name = item.name;
    dto.description = item.description;
    dto.cost = item.cost;
    dto.effect_code = item.effect_code;
    dto.required_study_time = item.required_study_time;
    dto.image_url = item.image_url;
    dto.grade = item.grade;

    return dto;
  }
}
