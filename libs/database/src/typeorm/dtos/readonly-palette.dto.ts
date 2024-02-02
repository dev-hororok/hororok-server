import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ReadOnlyPaletteDto {
  @IsNumber()
  @IsNotEmpty()
  palette_id: number;

  @IsNumber()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  grade: string;

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
