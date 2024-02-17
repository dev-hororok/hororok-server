import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  FindOneOptions,
  QueryRunner,
  Repository,
} from 'typeorm';
import { CharacterInventory } from '../database/entities/character-inventory.entity';

@Injectable()
export class CharacterInventoryService {
  constructor(
    @InjectRepository(CharacterInventory)
    private characterInventoryRepository: Repository<CharacterInventory>,
  ) {}

  /** queryRunner 여부에 따라 CharacterInventory Repository를 생성 */
  private getRepository(
    queryRunner?: QueryRunner,
  ): Repository<CharacterInventory> {
    return queryRunner
      ? queryRunner.manager.getRepository(CharacterInventory)
      : this.characterInventoryRepository;
  }

  async findAll(
    options?: FindManyOptions<CharacterInventory>,
    queryRunner?: QueryRunner,
  ): Promise<CharacterInventory[]> {
    const repository = this.getRepository(queryRunner);
    return repository.find(options);
  }

  async findOne(
    options: FindOneOptions<CharacterInventory>,
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
