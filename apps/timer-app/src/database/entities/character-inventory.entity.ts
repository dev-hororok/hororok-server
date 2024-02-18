import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommonEntity } from './common.entity';
import { IsNumber } from 'class-validator';
import { CharacterInventory } from '../domain/character-inventory';
import { CharacterEntity } from './character.entity';
import { MemberEntity } from './member.entity';

@Entity({
  name: 'character_inventory',
})
export class CharacterInventoryEntity
  extends CommonEntity
  implements CharacterInventory
{
  @PrimaryGeneratedColumn({ type: 'bigint' })
  character_inventory_id: number;

  @Column()
  @IsNumber()
  quantity: number;

  @ManyToOne(() => CharacterEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'character_id' })
  character?: CharacterEntity;

  @ManyToOne(() => MemberEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id' })
  member?: MemberEntity;
}
