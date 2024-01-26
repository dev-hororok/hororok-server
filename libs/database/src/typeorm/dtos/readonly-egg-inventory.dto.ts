import { IsNotEmpty, IsNumber, IsObject, IsString } from 'class-validator';
import { ReadOnlyEggDto } from './readonly-egg.dto';

export class ReadOnlyEggInventoryDto {
  @IsString()
  @IsNotEmpty()
  egg_inventory_id: string;

  @IsNumber()
  @IsNotEmpty()
  progress: number;

  @IsObject()
  @IsNotEmpty()
  egg: ReadOnlyEggDto;
}
