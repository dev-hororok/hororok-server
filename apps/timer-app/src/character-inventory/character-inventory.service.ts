import { CharacterInventory } from '@app/database/typeorm/entities/character-inventory.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class CharacterInventoryService {
  constructor(
    @InjectRepository(CharacterInventory)
    private characterInventoryRepository: Repository<CharacterInventory>,
  ) {}

  async findAll(
    options?: FindManyOptions<CharacterInventory>,
  ): Promise<CharacterInventory[]> {
    return this.characterInventoryRepository.find(options);
  }

  async findOne(
    options: FindOneOptions<CharacterInventory>,
  ): Promise<CharacterInventory | null> {
    return this.characterInventoryRepository.findOne(options);
  }

  async delete(id: number): Promise<void> {
    await this.characterInventoryRepository.delete(id);
  }
}
