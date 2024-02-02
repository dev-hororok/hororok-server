import { Injectable } from '@nestjs/common';
import { Item } from '@app/database/typeorm/entities/item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
  ) {}

  async findByItemType(itemType: string) {
    const items = await this.itemsRepository.find({
      where: {
        item_type: itemType,
      },
    });
    return items;
  }
}
