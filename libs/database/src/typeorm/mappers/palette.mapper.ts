import { ReadOnlyPaletteDto } from '../dtos/readonly-palette.dto';
import { Palette } from '../entities/palette.entity';

export class PaletteMapper {
  static toDto(palette: Palette): ReadOnlyPaletteDto {
    const dto = new ReadOnlyPaletteDto();

    dto.palette_id = palette.palette_id;
    dto.name = palette.name;
    dto.grade = palette.grade;
    dto.light_color = palette.light_color;
    dto.normal_color = palette.normal_color;
    dto.dark_color = palette.dark_color;
    dto.darker_color = palette.darker_color;

    return dto;
  }
}
