import { IsIn, IsNotEmpty } from 'class-validator';

export class ItemInventoryQueryDto {
  @IsNotEmpty({ message: 'item_type is required' })
  @IsIn(['Food', 'Consumable'], {
    message: 'item_type must be either Food or Consumable',
  })
  item_type: 'Food' | 'Consumable';
}
