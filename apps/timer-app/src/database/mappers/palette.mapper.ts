import { Palette } from '../domain/palette';
import { PaletteEntity } from '../entities/palette.entity';

export class PaletteMapper {
  static toDomain(raw: PaletteEntity): Palette {
    const palette = new Palette();

    palette.palette_id = raw.palette_id;
    palette.name = raw.name;
    palette.grade = raw.grade;
    palette.light_color = raw.light_color;
    palette.normal_color = raw.normal_color;
    palette.dark_color = raw.dark_color;
    palette.darker_color = raw.darker_color;

    if (raw.study_streaks) {
      palette.study_streaks = raw.study_streaks; //mapper
    }

    palette.created_at = raw.created_at;
    palette.updated_at = raw.updated_at;
    palette.deleted_at = raw.deleted_at;

    return palette;
  }
}
