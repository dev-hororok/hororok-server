import { EggInventory } from '@app/database/typeorm/entities/egg-inventory.entity';
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class EggInventoryService {
  constructor(
    @Inject('EGG_INVENTORY_REPOSITORY')
    private eggInventoryRepository: Repository<EggInventory>,
  ) {}

  async findAll(): Promise<EggInventory[]> {
    return this.eggInventoryRepository.find();
  }

  async findOne(id: string): Promise<EggInventory> {
    return this.eggInventoryRepository.findOne({
      where: { egg_inventory_id: id },
    });
  }

  async findByMemberId(member_id: string): Promise<EggInventory[]> {
    return this.eggInventoryRepository.find({
      where: { member: { member_id } },
    });
  }

  async delete(id: string): Promise<void> {
    await this.eggInventoryRepository.delete(id);
  }
}
