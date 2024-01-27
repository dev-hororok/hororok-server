import { EggInventory } from '@app/database/typeorm/entities/egg-inventory.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EggInventoryService {
  constructor(
    @InjectRepository(EggInventory)
    private eggInventoryRepository: Repository<EggInventory>,
  ) {}

  async findAll(): Promise<EggInventory[]> {
    return this.eggInventoryRepository.find();
  }

  async findOne(id: string): Promise<EggInventory> {
    return this.eggInventoryRepository.findOne({
      where: { egg_inventory_id: id },
      relations: ['egg'],
    });
  }

  async findByMemberId(member_id: string): Promise<EggInventory[]> {
    return this.eggInventoryRepository.find({
      where: { member: { member_id } },
      relations: ['egg'],
    });
  }

  async delete(id: string): Promise<void> {
    await this.eggInventoryRepository.delete(id);
  }
}
