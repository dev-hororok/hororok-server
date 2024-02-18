import { Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { ItemInventory } from '../database/domain/item-inventory';
import { ItemInventoryRepository } from './repositories/item-inventory.repository.interface';
import { Member } from '../database/domain/member';

@Injectable()
export class ItemInventoryService {
  constructor(
    private readonly itemInventoryRepository: ItemInventoryRepository,
  ) {}

  async getMemeberInventory(
    memberId: Member['member_id'],
    itemType: 'Food' | 'Consumable',
    queryRunner?: QueryRunner,
  ): Promise<ItemInventory[]> {
    return this.itemInventoryRepository.getMemeberInventory(
      memberId,
      itemType,
      queryRunner,
    );
  }

  async update(
    id: number,
    itemInventory: Partial<ItemInventory>,
    queryRunner?: QueryRunner,
  ): Promise<ItemInventory | null> {
    return await this.itemInventoryRepository.update(
      id,
      itemInventory,
      queryRunner,
    );
  }

  async softDelete(
    id: ItemInventory['item_inventory_id'],
    queryRunner?: QueryRunner,
  ): Promise<void> {
    await this.itemInventoryRepository.softDelete(id, queryRunner);
  }

  /** 멤버가 소유한 모든 FoodInventory의 progress값을 experience만큼 감소 */
  async decreaseFoodProgressByExperience(
    memberId: Member['member_id'],
    experience: number,
    queryRunner?: QueryRunner,
  ): Promise<void> {
    const memberFoods = await this.getMemeberInventory(
      memberId,
      'Food',
      queryRunner,
    );

    for (const food of memberFoods) {
      if (food.progress && 0 < food.progress) {
        const newProgress = Math.max(0, food.progress - experience);
        await this.update(
          food.item_inventory_id,
          {
            progress: newProgress,
          },
          queryRunner,
        );
      }
    }
  }
}
