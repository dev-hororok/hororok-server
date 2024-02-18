import { Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemEntity } from '../database/entities/item.entity';
import { Item } from '../database/domain/item';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(ItemEntity)
    private readonly itemsRepository: Repository<ItemEntity>,
  ) {}

  async findAll(options?: FindManyOptions<ItemEntity>): Promise<Item[]> {
    return await this.itemsRepository.find(options);
  }
}
