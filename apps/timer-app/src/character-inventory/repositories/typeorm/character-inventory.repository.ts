import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, MoreThan, QueryRunner, Repository } from 'typeorm';
import { EntityCondition } from '../../../utils/types/entity-condition.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { CharacterInventory } from 'apps/timer-app/src/database/domain/character-inventory';
import { CharacterInventoryEntity } from 'apps/timer-app/src/database/entities/character-inventory.entity';
import { CharacterInventoryRepository } from '../character-inventory.repository.interface';
import { CharacterInventoryMapper } from 'apps/timer-app/src/database/mappers/character-inventory.mapper';
import { Member } from 'apps/timer-app/src/database/domain/member';
import { STATUS_MESSAGES } from 'apps/timer-app/src/utils/constants';

@Injectable()
export class TypeOrmCharacterInventoryRepository
  implements CharacterInventoryRepository
{
  constructor(
    @InjectRepository(CharacterInventoryEntity)
    private characterInventoryRepository: Repository<CharacterInventoryEntity>,
  ) {}

  /** queryRunner 여부에 따라 CharacterInventory Repository를 생성 */
  private getRepository(
    queryRunner?: QueryRunner,
  ): Repository<CharacterInventoryEntity> {
    return queryRunner
      ? queryRunner.manager.getRepository(CharacterInventoryEntity)
      : this.characterInventoryRepository;
  }

  async getMemeberInventory(
    memberId: Member['member_id'],
    queryRunner?: QueryRunner,
  ): Promise<CharacterInventory[]> {
    const repository = this.getRepository(queryRunner);

    const entities = await repository.find({
      where: { member: { member_id: memberId }, quantity: MoreThan(0) },
      relations: {
        character: true,
      },
    });

    return entities.map((n) => CharacterInventoryMapper.toDomain(n));
  }

  async findOne(
    fields: EntityCondition<CharacterInventory>,
    queryRunner?: QueryRunner,
  ): Promise<NullableType<CharacterInventory>> {
    const repository = this.getRepository(queryRunner);

    const entity = await repository.findOne({
      where: fields as FindOptionsWhere<CharacterInventoryEntity>,
    });

    return entity ? CharacterInventoryMapper.toDomain(entity) : null;
  }

  async update(
    id: CharacterInventory['character_inventory_id'],
    payload: Partial<CharacterInventory>,
    queryRunner?: QueryRunner,
  ): Promise<CharacterInventory> {
    const repository = this.getRepository(queryRunner);
    const entity = await repository.findOne({
      where: { character_inventory_id: id },
    });

    if (!entity) {
      throw new NotFoundException(
        STATUS_MESSAGES.RESOURCE.RESOURCE_NOT_FOUND('캐릭터 인벤토리'),
      );
    }

    const updatedEntity = await this.characterInventoryRepository.save(
      this.characterInventoryRepository.create(
        CharacterInventoryMapper.toPersistence({
          ...CharacterInventoryMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return CharacterInventoryMapper.toDomain(updatedEntity);
  }

  async softDelete(
    id: CharacterInventory['character_inventory_id'],
    queryRunner?: QueryRunner,
  ): Promise<void> {
    const repository = this.getRepository(queryRunner);
    await repository.softDelete(id);
  }
}
