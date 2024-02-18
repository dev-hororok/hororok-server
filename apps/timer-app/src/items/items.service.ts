import { Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { Item } from '../database/domain/item';
import { ItemRepository } from './repositories/item.repository.interface';

@Injectable()
export class ItemsService {
  constructor(private readonly itemsRepository: ItemRepository) {}

  async getShopItem(
    itemType: 'Food' | 'Consumable',
    queryRunner?: QueryRunner,
  ): Promise<Item[]> {
    return await this.itemsRepository.getShopItem(itemType, queryRunner);
  }
}
