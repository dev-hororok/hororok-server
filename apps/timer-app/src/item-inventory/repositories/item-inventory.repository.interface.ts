import { QueryRunner } from 'typeorm';
import { EntityCondition } from '../../utils/types/entity-condition.type';
import { NullableType } from '../../utils/types/nullable.type';
import { Member } from '../../database/domain/member';
import { ItemInventory } from '../../database/domain/item-inventory';

export abstract class ItemInventoryRepository {
  // quantity 0이상 조회, relation: [character]
  abstract getMemeberInventory(
    memberId: Member['member_id'],
    itemType: 'Food' | 'Consumable',
    queryRunner?: QueryRunner,
  ): Promise<ItemInventory[]>;

  abstract findOne(
    fields: EntityCondition<ItemInventory>,
    queryRunner?: QueryRunner,
  ): Promise<NullableType<ItemInventory>>;

  abstract update(
    id: ItemInventory['item_inventory_id'],
    payload: Partial<ItemInventory>,
    queryRunner?: QueryRunner,
  ): Promise<NullableType<ItemInventory>>;

  abstract softDelete(
    id: ItemInventory['item_inventory_id'],
    queryRunner?: QueryRunner,
  ): Promise<void>;
}
