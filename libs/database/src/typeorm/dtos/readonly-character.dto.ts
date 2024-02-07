import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ReadOnlyCharacterDto {
  @IsNumber()
  @IsNotEmpty()
  character_id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string | null;

  @IsString()
  image_url: string;

  @IsString()
  @IsNotEmpty()
  grade: string;

  @IsNumber()
  @IsNotEmpty()
  sell_price: number;
}
