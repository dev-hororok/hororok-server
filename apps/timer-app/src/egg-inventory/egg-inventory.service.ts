import { EggInventory } from '@app/database/typeorm/entities/egg-inventory.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class EggInventoryService {
  constructor(
    @InjectRepository(EggInventory)
    private eggInventoryRepository: Repository<EggInventory>,
  ) {}

  async findAll(
    options?: FindManyOptions<EggInventory>,
  ): Promise<EggInventory[]> {
    return this.eggInventoryRepository.find(options);
  }

  async findOne(
    options: FindOneOptions<EggInventory>,
  ): Promise<EggInventory | null> {
    return this.eggInventoryRepository.findOne(options);
  }

  async delete(id: string): Promise<void> {
    await this.eggInventoryRepository.delete(id);
  }
}
