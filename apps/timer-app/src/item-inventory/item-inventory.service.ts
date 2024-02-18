import { Injectable } from '@nestjs/common';
import { FindManyOptions, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemInventoryEntity } from '../database/entities/item-inventory.entity';
import { ItemInventory } from '../database/domain/item-inventory';

@Injectable()
export class ItemInventoryService {
  constructor(
    @InjectRepository(ItemInventoryEntity)
    private itemInventoryRepository: Repository<ItemInventoryEntity>,
  ) {}
  /** queryRunner 여부에 따라 ItemInventory Repository를 생성 */
  private getRepository(
    queryRunner?: QueryRunner,
  ): Repository<ItemInventoryEntity> {
    return queryRunner
      ? queryRunner.manager.getRepository(ItemInventoryEntity)
      : this.itemInventoryRepository;
  }

  async findAll(
    options?: FindManyOptions<ItemInventoryEntity>,
    queryRunner?: QueryRunner,
  ): Promise<ItemInventory[]> {
    const repository = this.getRepository(queryRunner);
    return repository.find(options);
  }

  async update(
    id: number,
    itemInventory: Partial<ItemInventory>,
    queryRunner?: QueryRunner,
  ): Promise<boolean> {
    const repository = this.getRepository(queryRunner);
    const result = await repository.update(id, itemInventory);
    return result.affected ? 0 < result.affected : false;
  }

  async delete(id: string, queryRunner?: QueryRunner): Promise<void> {
    const repository = this.getRepository(queryRunner);
    await repository.delete(id);
  }

  /** 멤버가 소유한 모든 FoodInventory의 progress값을 experience만큼 감소 */
  async decreaseFoodProgressByExperience(
    memberId: string,
    experience: number,
    queryRunner?: QueryRunner,
  ): Promise<void> {
    const repository = this.getRepository(queryRunner);
    const memberFoods = await repository.find({
      where: { member: { member_id: memberId }, item_type: 'Food' },
    });

    for (const food of memberFoods) {
      if (food.progress && 0 < food.progress) {
        const newProgress = Math.max(0, food.progress - experience);
        await repository.update(food.item_inventory_id, {
          progress: newProgress,
        });
      }
    }
  }
}
