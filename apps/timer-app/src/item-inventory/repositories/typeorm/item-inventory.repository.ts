import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, MoreThan, QueryRunner, Repository } from 'typeorm';
import { EntityCondition } from '../../../utils/types/entity-condition.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { Member } from 'apps/timer-app/src/database/domain/member';
import { ItemInventoryRepository } from '../item-inventory.repository.interface';
import { ItemInventoryEntity } from 'apps/timer-app/src/database/entities/item-inventory.entity';
import { ItemInventoryMapper } from 'apps/timer-app/src/database/mappers/item-inventory.mapper';
import { ItemInventory } from 'apps/timer-app/src/database/domain/item-inventory';
import { STATUS_MESSAGES } from 'apps/timer-app/src/utils/constants';

@Injectable()
export class TypeOrmItemInventoryRepository implements ItemInventoryRepository {
  constructor(
    @InjectRepository(ItemInventoryEntity)
    private itemInventoryRepository: Repository<ItemInventoryEntity>,
  ) {}

  /** queryRunner 여부에 따라 itemInventory Repository를 생성 */
  private getRepository(
    queryRunner?: QueryRunner,
  ): Repository<ItemInventoryEntity> {
    return queryRunner
      ? queryRunner.manager.getRepository(ItemInventoryEntity)
      : this.itemInventoryRepository;
  }

  async getMemeberInventory(
    memberId: Member['member_id'],
    itemType: 'Food' | 'Consumable',
    queryRunner?: QueryRunner,
  ): Promise<ItemInventory[]> {
    const repository = this.getRepository(queryRunner);

    const entities = await repository.find({
      where: {
        member: { member_id: memberId },
        item_type: itemType,
        quantity: MoreThan(0),
      },
      relations: {
        item: true,
      },
    });

    return entities.map((n) => ItemInventoryMapper.toDomain(n));
  }

  async findOne(
    fields: EntityCondition<ItemInventory>,
    queryRunner?: QueryRunner,
  ): Promise<NullableType<ItemInventory>> {
    const repository = this.getRepository(queryRunner);

    const entity = await repository.findOne({
      where: fields as FindOptionsWhere<ItemInventoryEntity>,
    });

    return entity ? ItemInventoryMapper.toDomain(entity) : null;
  }

  async update(
    id: ItemInventory['item_inventory_id'],
    payload: Partial<ItemInventory>,
    queryRunner?: QueryRunner,
  ): Promise<ItemInventory> {
    const repository = this.getRepository(queryRunner);
    const entity = await repository.findOne({
      where: { item_inventory_id: id },
    });

    if (!entity) {
      throw new NotFoundException(
        STATUS_MESSAGES.RESOURCE.RESOURCE_NOT_FOUND('아이템 인벤토리'),
      );
    }

    const updatedEntity = await repository.save(
      repository.create(
        ItemInventoryMapper.toPersistence({
          ...ItemInventoryMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return ItemInventoryMapper.toDomain(updatedEntity);
  }

  async softDelete(
    id: ItemInventory['item_inventory_id'],
    queryRunner?: QueryRunner,
  ): Promise<void> {
    const repository = this.getRepository(queryRunner);
    await repository.softDelete(id);
  }
}
