import { QueryRunner } from 'typeorm';
import { Item, ItemType } from '../../database/domain/item';

export abstract class ItemRepository {
  abstract getShopItem(
    itemType: ItemType,
    queryRunner?: QueryRunner,
  ): Promise<Item[]>;
}
