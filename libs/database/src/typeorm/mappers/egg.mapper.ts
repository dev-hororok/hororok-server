import { ReadOnlyEggDto } from '../dtos/readonly-egg.dto';
import { Egg } from '../entities/egg.entity';

export class EggMapper {
  static toDto(egg: Egg): ReadOnlyEggDto {
    const dto = new ReadOnlyEggDto();

    dto.egg_id = egg.egg_id;
    dto.name = egg.name;
    dto.description = egg.description;
    dto.required_study_time = egg.required_study_time;
    dto.image_url = egg.image_url;
    dto.grade = egg.grade;

    return dto;
  }
}
