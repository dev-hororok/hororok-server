import { Controller, Get, Query } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemQueryDto } from './dto/item-query.dto';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  async findByItemType(@Query() queryDto: ItemQueryDto) {
    const items = await this.itemsService.getShopItem(queryDto.item_type);
    return { items };
  }
}
