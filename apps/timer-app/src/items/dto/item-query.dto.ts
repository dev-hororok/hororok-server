import { IsIn, IsNotEmpty } from 'class-validator';
import { ItemType, itemType } from '../../database/domain/item';

export class ItemQueryDto {
  @IsNotEmpty({ message: 'item_type is required' })
  @IsIn(itemType, {
    message: 'item_type must be either Food or Consumable',
  })
  item_type: ItemType;
}
