import { CharacterInventory } from '@app/database/typeorm/entities/character-inventory.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CharacterInventoryService {
  constructor(
    @InjectRepository(CharacterInventory)
    private characterInventoryRepository: Repository<CharacterInventory>,
  ) {}

  async findAll(): Promise<CharacterInventory[]> {
    return this.characterInventoryRepository.find();
  }

  async findOne(id: number): Promise<CharacterInventory> {
    return this.characterInventoryRepository.findOne({
      where: { character_inventory_id: id },
      relations: ['character'],
    });
  }

  async findByMemberId(member_id: string): Promise<CharacterInventory[]> {
    return this.characterInventoryRepository.find({
      where: { member: { member_id } },
      relations: ['character'],
    });
  }

  async delete(id: number): Promise<void> {
    await this.characterInventoryRepository.delete(id);
  }
}
