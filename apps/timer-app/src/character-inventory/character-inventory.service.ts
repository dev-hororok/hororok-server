import { Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { CharacterInventory } from '../database/domain/character-inventory';
import { CharacterInventoryRepository } from './repositories/character-inventory.repository.interface';
import { EntityCondition } from '../utils/types/entity-condition.type';
import { Member } from '../database/domain/member';

@Injectable()
export class CharacterInventoryService {
  constructor(
    private readonly characterInventoryRepository: CharacterInventoryRepository,
  ) {}

  async getMemeberInventory(
    memberId: Member['member_id'],
    queryRunner?: QueryRunner,
  ): Promise<CharacterInventory[]> {
    return this.characterInventoryRepository.getMemeberInventory(
      memberId,
      queryRunner,
    );
  }

  async findOne(
    options: EntityCondition<CharacterInventory>,
    queryRunner?: QueryRunner,
  ): Promise<CharacterInventory | null> {
    return this.characterInventoryRepository.findOne(options, queryRunner);
  }

  async delete(id: number, queryRunner?: QueryRunner): Promise<void> {
    await this.characterInventoryRepository.softDelete(id, queryRunner);
  }
}
