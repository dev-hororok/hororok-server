import { Injectable } from '@nestjs/common';
import { ItemInventory } from '@app/database/typeorm/entities/item-inventory.entity';
import { FindManyOptions, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ItemInventoryService {
  constructor(
    @InjectRepository(ItemInventory)
    private itemInventoryRepository: Repository<ItemInventory>,
  ) {}
  /** queryRunner 여부에 따라 ItemInventory Repository를 생성 */
  private getRepository(queryRunner?: QueryRunner): Repository<ItemInventory> {
    return queryRunner
      ? queryRunner.manager.getRepository(ItemInventory)
      : this.itemInventoryRepository;
  }

  async findAll(
    options?: FindManyOptions<ItemInventory>,
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
