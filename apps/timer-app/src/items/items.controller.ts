import { Controller, Get, Query } from '@nestjs/common';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  async findByItemType(@Query('item_type') itemType: string) {
    const itmes = await this.itemsService.findAll({
      where: {
        item_type: itemType,
        is_hidden: false,
      },
    });
    return { itmes };
  }
}
