import { IsDate, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { PaletteGrade } from '../enums/palette-grade.enum';

export class ReadOnlyPaletteDto {
  @IsNumber()
  @IsNotEmpty()
  palette_id: number;

  @IsNumber()
  @IsNotEmpty()
  name: string;

  @IsEnum(PaletteGrade)
  @IsNotEmpty()
  grade: PaletteGrade;

  @IsDate()
  @IsNotEmpty()
  light_color: string;

  @IsDate()
  @IsNotEmpty()
  normal_color: string;

  @IsDate()
  @IsNotEmpty()
  dark_color: string;

  @IsDate()
  @IsNotEmpty()
  darker_color: string;
}
