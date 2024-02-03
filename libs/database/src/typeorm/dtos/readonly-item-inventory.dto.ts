import { IsNotEmpty, IsNumber, IsObject, IsString } from 'class-validator';
import { ReadOnlyItemDto } from './readonly-item.dto';

export class ReadOnlyItemInventoryDto {
  @IsString()
  @IsNotEmpty()
  item_inventory_id: string;

  @IsNumber()
  progress: number | null;

  @IsString()
  @IsNotEmpty()
  item_type: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsObject()
  @IsNotEmpty()
  item: ReadOnlyItemDto;
}
