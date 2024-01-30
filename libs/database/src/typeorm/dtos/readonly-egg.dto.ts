import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ReadOnlyEggDto {
  @IsString()
  @IsNotEmpty()
  egg_id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  purchase_price: number;

  @IsNumber()
  @IsNotEmpty()
  required_study_time: number;

  @IsString()
  image_url: string;

  @IsString()
  @IsNotEmpty()
  grade: string;
}
