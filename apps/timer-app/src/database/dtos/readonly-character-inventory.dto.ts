import { IsNotEmpty, IsNumber, IsObject } from 'class-validator';
import { ReadOnlyCharacterDto } from './readonly-character.dto';

export class ReadOnlyCharacterInventoryDto {
  @IsNumber()
  @IsNotEmpty()
  character_inventory_id: number;

  @IsObject()
  @IsNotEmpty()
  character: ReadOnlyCharacterDto;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
