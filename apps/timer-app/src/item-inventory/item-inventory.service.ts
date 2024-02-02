import { Injectable } from '@nestjs/common';
import { ItemInventory } from '@app/database/typeorm/entities/item-inventory.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ItemInventoryService {
  constructor(
    @InjectRepository(ItemInventory)
    private itemInventoryRepository: Repository<ItemInventory>,
  ) {}

  async findByMemberIdAndItemType(
    member_id: string,
    item_type: string,
  ): Promise<ItemInventory[]> {
    return this.itemInventoryRepository.find({
      where: { member: { member_id }, item_type: item_type },
      relations: ['item'],
    });
  }

  async update(
    id: string,
    itemInventory: Partial<ItemInventory>,
  ): Promise<ItemInventory> {
    await this.itemInventoryRepository.update(id, itemInventory);
    return this.itemInventoryRepository.findOne({
      where: { item_inventory_id: id },
    });
  }

  async delete(id: string): Promise<void> {
    await this.itemInventoryRepository.delete(id);
  }
}
