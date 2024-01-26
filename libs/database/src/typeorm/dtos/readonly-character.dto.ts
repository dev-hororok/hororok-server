import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ReadOnlyCharacterDto {
  @IsString()
  @IsNotEmpty()
  character_id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsString()
  image_url: string;

  @IsString()
  @IsNotEmpty()
  grade: string;

  @IsNumber()
  @IsNotEmpty()
  sell_price: number;
}
