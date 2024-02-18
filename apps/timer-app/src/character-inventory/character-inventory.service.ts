import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  FindOneOptions,
  QueryRunner,
  Repository,
} from 'typeorm';
import { CharacterInventoryEntity } from '../database/entities/character-inventory.entity';
import { CharacterInventory } from '../database/domain/character-inventory';

@Injectable()
export class CharacterInventoryService {
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

  async findAll(
    options?: FindManyOptions<CharacterInventoryEntity>,
    queryRunner?: QueryRunner,
  ): Promise<CharacterInventory[]> {
    const repository = this.getRepository(queryRunner);
    return repository.find(options);
  }

  async findOne(
    options: FindOneOptions<CharacterInventoryEntity>,
    queryRunner?: QueryRunner,
  ): Promise<CharacterInventory | null> {
    const repository = this.getRepository(queryRunner);
    return repository.findOne(options);
  }

  async delete(id: number, queryRunner?: QueryRunner): Promise<void> {
    const repository = this.getRepository(queryRunner);
    await repository.delete(id);
  }
}
