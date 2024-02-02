import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ReadOnlyItemDto {
  @IsString()
  @IsNotEmpty()
  item_id: string;

  @IsString()
  @IsNotEmpty()
  item_type: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  grade: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  image_url: string;

  @IsNumber()
  @IsNotEmpty()
  cost: number;

  @IsNumber()
  required_study_time: number;

  @IsNumber()
  @IsNotEmpty()
  effect_code: number;
}
