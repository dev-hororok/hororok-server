import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { ItemRepository } from '../item.repository.interface';
import { ItemEntity } from 'apps/timer-app/src/database/entities/item.entity';
import { Item, ItemType } from 'apps/timer-app/src/database/domain/item';
import { ItemMapper } from 'apps/timer-app/src/database/mappers/item.mapper';

@Injectable()
export class TypeOrmItemRepository implements ItemRepository {
  constructor(
    @InjectRepository(ItemEntity)
    private itemRepository: Repository<ItemEntity>,
  ) {}

  /** queryRunner 여부에 따라 item Repository를 생성 */
  private getRepository(queryRunner?: QueryRunner): Repository<ItemEntity> {
    return queryRunner
      ? queryRunner.manager.getRepository(ItemEntity)
      : this.itemRepository;
  }

  async getShopItem(
    itemType: ItemType,
    queryRunner?: QueryRunner,
  ): Promise<Item[]> {
    const repository = this.getRepository(queryRunner);

    const entities = await repository.find({
      where: { item_type: itemType, is_hidden: false },
    });

    return entities.map((n) => ItemMapper.toDomain(n));
  }
}
