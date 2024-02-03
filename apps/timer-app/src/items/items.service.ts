import { Injectable } from '@nestjs/common';
import { Item } from '@app/database/typeorm/entities/item.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
  ) {}

  async findAll(options?: FindManyOptions<Item>): Promise<Item[]> {
    return await this.itemsRepository.find(options);
  }
}
