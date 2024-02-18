import { QueryRunner } from 'typeorm';
import { CharacterInventory } from '../../database/domain/character-inventory';
import { EntityCondition } from '../../utils/types/entity-condition.type';
import { NullableType } from '../../utils/types/nullable.type';
import { Member } from '../../database/domain/member';

export abstract class CharacterInventoryRepository {
  // quantity 0이상 조회, relation: [character]
  abstract getMemeberInventory(
    memberId: Member['member_id'],
    queryRunner?: QueryRunner,
  ): Promise<CharacterInventory[]>;

  abstract findOne(
    fields: EntityCondition<CharacterInventory>,
    queryRunner?: QueryRunner,
  ): Promise<NullableType<CharacterInventory>>;

  abstract update(
    id: CharacterInventory['character_inventory_id'],
    payload: Partial<CharacterInventory>,
    queryRunner?: QueryRunner,
  ): Promise<NullableType<CharacterInventory>>;

  abstract softDelete(
    id: CharacterInventory['character_inventory_id'],
    queryRunner?: QueryRunner,
  ): Promise<void>;
}
